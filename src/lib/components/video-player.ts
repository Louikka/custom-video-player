import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
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


    @state() private vCurrentTime = 0;
    @state() private vPaused = true;
    @state() private vSeeking = false;

    private onVideoTimeUpdate(ev: Event)
    {
        const video = ev.currentTarget as HTMLVideoElement;

        this.vCurrentTime = video.currentTime;

        const canvasElement = this.canvasElementRef.value;
        if (canvasElement)
        {
            manageCanvasElementsOnTimeupdate(video, canvasElement, this.canvas.children);
        }
    }


    protected override render()
    {
        return html`
            <div class="_w" ${ref(this.wrapperElementRef)}>
                <video
                    ${ref(this.videoElementRef)}

                    src=${this.src ?? nothing}

                    @pause=${() => this.vPaused = true}
                    @play=${() => this.vPaused = false}
                    @timeupdate=${this.onVideoTimeUpdate}
                >
                    <!-- TODO: correctly implement slotted content (sources) -->
                    <!-- <slot></slot> -->
                </video>

                <div class="canvas" ${ref(this.canvasElementRef)}></div>

                <div class="controls">
                    <vp-controls
                        .wrapperElementRef=${this.wrapperElementRef}
                        .videoElementRef=${this.videoElementRef}
                        .vCurrentTime=${this.vCurrentTime}
                        .vPaused=${this.vPaused}
                    ></vp-controls>
                </div>
            </div>
        `;
    }
}
