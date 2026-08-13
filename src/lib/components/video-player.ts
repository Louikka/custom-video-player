import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { styleMap, type StyleInfo } from 'lit/directives/style-map.js';
import type { CanvasElement, DisplayTiming } from '../../types/global';
import { canvasElementIDClassTemplate } from '../shared';
import { manageCanvasElementsOnTimeupdate } from '../helpers';

import './vp-controls';

import styles from './video-player.css?inline';


interface VideoPlayerCanvas {
    readonly children: CanvasElement[];

    /**
     * Adds an HTMLElement to the canvas children.
     *
     * @param e element that should be displayed on canvas.
     * @param dt timings to display element.
     * @param id optional ID for element (required to be able to delete element from canvas).
     */
    addChild(e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id?: string): void;

    /**
     * Removes an element with specified `id` from canvas children.
     */
    removeChild(id: string): void;

    /**
     * Removes all canvas children.
     */
    removeAllChildren(): void;
}

@customElement('video-player')
export class VideoPlayer extends LitElement
{
    static override styles = unsafeCSS(styles);


    private wrapperElementRef: Ref<HTMLElement> = createRef();
    private videoElementRef: Ref<HTMLVideoElement> = createRef();
    private canvasElementRef: Ref<HTMLElement> = createRef();


    @property({ type: Boolean }) public controls: boolean = false;
    @property({ type: String }) public src?: string;

    @property({ attribute: false }) public currentTime = NaN;

    @state() private _duration = NaN;
    @property({ attribute: false })
    public get duration()
    {
        return this.videoElementRef.value?.duration ?? this._duration;
    }

    @property({ attribute: false }) public paused = true;

    @property({ attribute: false })
    public readonly canvas: VideoPlayerCanvas = {
        children: [],
        addChild(e, dt, id = crypto.randomUUID())
        {
            e.classList.add(canvasElementIDClassTemplate + id);
            this.children.push({
                e,
                id,
                dt,
                isMounted: false,
            });
        },
        removeChild(id)
        {
            const i = this.children.findIndex(e => e.id === id);
            if (i > -1)
            {
                this.children.splice(i, 1);
            }
            else
            {
                console.warn(`Cannot find element with id "${id}" on canvas.`);
            }
        },
        removeAllChildren()
        {
            this.children.length = 0;
        },
    };


    @state() private isMouseOverWrapper = false;
    @state() private isMouseOverControls = false;

    @state() private _showControlsOnLoad = true;
    @state() private _isControlsTimedOut = false;

    @state()
    private get isControlsVisible()
    {
        if (this._showControlsOnLoad) return true;
        if (this.isMouseOverControls) return true;
        if (this._isControlsTimedOut) return false;
        return true;
    }

    private _controlsTimeoutTimerID?: number;
    private handleControlsTimeout()
    {
        clearTimeout(this._controlsTimeoutTimerID);

        if (this.isMouseOverWrapper)
        {
            this._isControlsTimedOut = false;

            this._controlsTimeoutTimerID = setTimeout(() =>
            {
                this._isControlsTimedOut = true;
            }, 2000);
        }
        else
        {
            this._isControlsTimedOut = true;
        }
    }

    @state() private _isCursorTimedOut = false;

    /** Controls if cursor should be hidden or not (typically, after a period of inactivity). */
    @state()
    private get isCursorHidden()
    {
        if (this.isMouseOverControls) return false;
        return this._isCursorTimedOut;
    }

    private _cursorTimeoutTimerID?: number;
    private handleCursorIdling()
    {
        this._isCursorTimedOut = false;

        clearTimeout(this._cursorTimeoutTimerID);

        this._cursorTimeoutTimerID = setTimeout(() =>
        {
            this._isCursorTimedOut = true;
        }, 3000);
    }


    /* Event handlers */

    private onWindowMouseMove = (ev: MouseEvent) =>
    {
        this.handleControlsTimeout();
        this.handleCursorIdling();
    };
    private onWindowMouseDown = (ev: MouseEvent) =>
    {
        this.handleCursorIdling();
    };

    private onMediaDurationChange(ev: Event)
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this._duration = e.duration;
    }

    private onMediaLoadedMetadata(ev: Event)
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.currentTime = e.currentTime;
        this._duration = e.duration;
    }

    private onMediaPauseOrPlay(ev: Event)
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.paused = e.paused;
    }

    private onVideoTimeUpdate(ev: Event)
    {
        const video = ev.currentTarget as HTMLVideoElement;

        this.currentTime = video.currentTime;

        const canvasElement = this.canvasElementRef.value;
        if (canvasElement)
        {
            manageCanvasElementsOnTimeupdate(video, canvasElement, this.canvas.children);
        }
    }



    override connectedCallback()
    {
        super.connectedCallback();

        window.addEventListener('mousemove', this.onWindowMouseMove);
        window.addEventListener('mousedown', this.onWindowMouseDown);
    }

    override disconnectedCallback()
    {
        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mousedown', this.onWindowMouseDown);

        super.disconnectedCallback();
    }


    protected override render()
    {
        const wrapperStyle: StyleInfo = {
            cursor: this.isCursorHidden && !this.isMouseOverControls ? 'none' : null,
        };
        const controlsStyle: StyleInfo = {
            visibility: this.isControlsVisible ? 'visible' : 'hidden',
            opacity: this.isControlsVisible ? '1' : '0',
        };

        return html`
            <div
                ${ref(this.wrapperElementRef)}

                class="_w"
                style=${styleMap(wrapperStyle)}

                @mouseenter=${() => {
                    this._showControlsOnLoad = false;
                    this.isMouseOverWrapper = true;
                }}
                @mouseleave=${() => this.isMouseOverWrapper = false}
            >
                <video
                    ${ref(this.videoElementRef)}

                    src=${this.src ?? nothing}

                    @durationchange=${this.onMediaDurationChange}
                    @loadedmetadata=${this.onMediaLoadedMetadata}
                    @pause=${this.onMediaPauseOrPlay}
                    @play=${this.onMediaPauseOrPlay}
                    @timeupdate=${this.onVideoTimeUpdate}
                >
                    <!-- TODO: correctly implement slotted content (sources) -->
                    <!-- <slot></slot> -->
                </video>

                <div class="canvas" ${ref(this.canvasElementRef)}></div>

                <div
                    class="controls"
                    style=${styleMap(controlsStyle)}

                    @mouseenter=${() => this.isMouseOverControls = true}
                    @mouseleave=${() => this.isMouseOverControls = false}
                >
                    <vp-controls
                        .wrapperElementRef=${this.wrapperElementRef}
                        .videoElementRef=${this.videoElementRef}
                        .vCurrentTime=${this.currentTime}
                        .vDuration=${this.duration}
                        .vPaused=${this.paused}
                    ></vp-controls>
                </div>
            </div>
        `;
    }
}
