import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type { Ref } from 'lit/directives/ref.js';
import { toggleFullscreen, togglePlayback } from '../toggles';
import { clamp, toHHMMSSDuration, toISODuration } from '../lib';
import { getMediaTimeRatio } from '../helpers';

import styles from './vp-controls.css?inline';

import icon_play from '../../assets/icons/videojs-v10/default/play.svg?raw';
import icon_pause from '../../assets/icons/videojs-v10/default/pause.svg?raw';
import icon_volume_off from '../../assets/icons/videojs-v10/default/volume-off.svg?raw';
import icon_volume_low from '../../assets/icons/videojs-v10/default/volume-low.svg?raw';
import icon_volume_high from '../../assets/icons/videojs-v10/default/volume-high.svg?raw';
import icon_fullscreen_enter from '../../assets/icons/videojs-v10/default/fullscreen-enter.svg?raw';
import icon_fullscreen_exit from '../../assets/icons/videojs-v10/default/fullscreen-exit.svg?raw';


@customElement('vp-controls')
export class VPControlsElement extends LitElement
{
    static override styles = unsafeCSS(styles);


    //#region Properties and attributes

    @property({ attribute: false }) public wrapperElementRef?: Ref<HTMLElement>;
    @property({ attribute: false }) public videoElementRef?: Ref<HTMLVideoElement>;


    /* Video time and duration */

    @property({ attribute: false }) public vCurrentTime = NaN;
    @property({ attribute: false }) public vDuration = NaN;
    @property({ attribute: false }) public vPaused = true;

    private get vCurrentTimeSafe()
    {
        return Number.isNaN(this.vCurrentTime) ? 0 : this.vCurrentTime;
    }

    private get isVideoDurationFinite()
    {
        return Number.isFinite(this.vDuration);
    }
    private get vDurationSafe()
    {
        return this.isVideoDurationFinite ? this.vDuration : 0;
    }

    private get videoTimeRatio()
    {
        return getMediaTimeRatio(this.vCurrentTime, this.vDurationSafe);
    }


    /* Video volume */

    private _volumeInitialValue = 1;
    private _previousVolume = this._volumeInitialValue;

    @state()
    private set volume(v)
    {
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            if (Number.isFinite(v))
            {
                video.volume = clamp(v, 0, 1);
                if (video.volume <= 0)
                {
                    video.muted = true;
                }
                else
                {
                    video.muted = false;
                }
            }
        }
        else
        {
            console.warn('Unable to set media\'s volume: media element is undefined.');
        }
    }
    private get volume()
    {
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            return video.volume;
        }
        else
        {
            return this._volumeInitialValue;
        }
    }

    private toggleMute()
    {
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            video.muted = !video.muted
            if (video.muted)
            {
                this._previousVolume = this.volume;
                this.volume = 0;
            }
            else
            {
                this.volume = this._previousVolume;
            }
        }
    }


    /* Video fullscreen */

    @state() private isVideoInFullscreen = false;

    //#endregion



    //#region Events

    /* Event handlers */

    private async onPlayButtonClick(ev: PointerEvent)
    {
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            /* this.videoPaused = */ await togglePlayback(video);
        }
    }

    private onPropgressBarInput(ev: InputEvent)
    {
        const input = ev.currentTarget as HTMLInputElement;

        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            const currentTime = this.vDurationSafe * Number(input.value);
            this.vCurrentTime = currentTime;
            video.currentTime = currentTime;
        }
    }

    private _wasVideoPausedBeforeSeeking = true;

    private onPropgressBarMouseDown(ev: MouseEvent)
    {
        const video = this.videoElementRef?.value;
        if (ev.button === 0 && video !== undefined)
        {
            this._wasVideoPausedBeforeSeeking = video.paused;
            video.pause();
        }
    }
    private onPropgressBarMouseUp(ev: MouseEvent)
    {
        const video = this.videoElementRef?.value;
        if (ev.button === 0 && video !== undefined && !this._wasVideoPausedBeforeSeeking)
        {
            video.play();
        }
    }

    private onVolumeInputInput(ev: InputEvent)
    {
        const input = ev.currentTarget as HTMLInputElement;
        this.volume = Number(input.value);
    }

    private async onFullscreenButtonClick(ev: PointerEvent)
    {
        const wrapper = this.wrapperElementRef?.value;
        if (wrapper !== undefined)
        {
            this.isVideoInFullscreen = await toggleFullscreen(wrapper)
        }
    }


    // Arrow function needed specifically, so that context won't get messed up
    private handleKeyboardInput = (ev: KeyboardEvent) =>
    {
        const wrapper = this.wrapperElementRef?.value;
        const video = this.videoElementRef?.value;

        switch (ev.key)
        {
            case ' ':
            {
                if (video) togglePlayback(video);
                break;
            }

            case 'ArrowLeft':
            {
                ev.preventDefault();

                if (video)
                {
                    video.currentTime -= 5;
                }

                break;
            }

            case 'ArrowRight':
            {
                ev.preventDefault();

                if (video)
                {
                    video.currentTime += 5;
                }

                break;
            }

            case 'ArrowUp':
            {
                ev.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                break;
            }

            case 'ArrowDown':
            {
                ev.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                break;
            }

            case 'f':
            case 'F':
            {
                if (wrapper)
                {
                    toggleFullscreen(wrapper).then(v => this.isVideoInFullscreen = v);
                }

                break;
            }

            case 'm':
            case 'M':
            {
                this.toggleMute();
                break;
            }
        }
    };

    //#endregion



    //#region Main render

    override connectedCallback()
    {
        super.connectedCallback();
        window.addEventListener('keydown', this.handleKeyboardInput);
    }

    override disconnectedCallback()
    {
        window.removeEventListener('keydown', this.handleKeyboardInput);
        super.disconnectedCallback();
    }



    private constructProcessBar(isDisabled = false)
    {
        if (isDisabled)
        {
            let maybeDuration;

            if (this.isVideoDurationFinite)
            {
                maybeDuration = html`
                    /
                    <time datetime=${toISODuration(this.vDuration)}>
                        ${toHHMMSSDuration(this.vDuration)}
                    </time>
                `;
            }

            return html`
                <div class="time">
                    <time datetime=${toISODuration(this.vCurrentTimeSafe)}>
                        ${toHHMMSSDuration(this.vCurrentTimeSafe)}
                    </time>
                    ${maybeDuration}
                </div>
                <div style="flex-grow:1"></div>
            `;
        }
        else
        {
            return html`
                <div class="time">
                    <time datetime=${toISODuration(this.vCurrentTimeSafe)}>
                        ${toHHMMSSDuration(this.vCurrentTimeSafe)}
                    </time>
                </div>
                <div class="input">
                    <div class="input-range">
                        <progress max="1" value=${this.videoTimeRatio}>
                            ${this.videoTimeRatio * 100}%
                        </progress>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="any"
                            .value=${this.videoTimeRatio}
                            @input=${this.onPropgressBarInput}
                            @mousedown=${this.onPropgressBarMouseDown}
                            @mouseup=${this.onPropgressBarMouseUp}
                        />
                    </div>
                </div>
                <div class="time">
                    <time datetime=${toISODuration(this.vDurationSafe)}>
                        ${toHHMMSSDuration(this.vDurationSafe)}
                    </time>
                </div>
            `;
        }
    }

    protected override render()
    {
        return html`
            <div class="_w">
                <div class="play">
                    <button
                        class="button"
                        title=${this.vPaused ? 'Play' : 'Pause'}
                        @click=${this.onPlayButtonClick}
                    >
                        ${this.vPaused
                            ? unsafeSVG(icon_play)
                            : unsafeSVG(icon_pause)}
                    </button>
                </div>

                <div class="progress">
                    ${this.constructProcessBar()}
                </div>

                <div class="volume">
                    <button
                        class="button"
                        title=${this.volume <= 0 ? 'Unmute' : 'Mute'}
                        @click=${this.toggleMute}
                    >
                        ${this.volume <= 0
                            ? unsafeSVG(icon_volume_off)
                            : this.volume > 0 && this.volume < 0.5
                                ? unsafeSVG(icon_volume_low)
                                : unsafeSVG(icon_volume_high)}
                    </button>

                    <div class="volume-bar-wrapper">
                        <div class="volume-bar">
                            <div class="input-range">
                                <meter value=${this.volume}>${this.volume * 100}%</meter>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="any"
                                    .value=${this.volume}
                                    @input=${this.onVolumeInputInput}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="c">
                    <button
                        class="button"
                        title=${this.isVideoInFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        @click=${this.onFullscreenButtonClick}
                    >
                        ${this.isVideoInFullscreen
                            ? unsafeSVG(icon_fullscreen_exit)
                            : unsafeSVG(icon_fullscreen_enter)}
                    </button>
                </div>
            </div>
        `;
    }

    //#endregion
}
