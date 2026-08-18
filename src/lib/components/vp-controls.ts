import { LitElement, html, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type { Ref } from 'lit/directives/ref.js';
import { toggleFullscreen, togglePlayback } from '../toggles.js';
import { clamp, toHHMMSSDuration, toISODuration } from '../lib.js';
import { getMediaTimeRatio } from '../helpers.js';

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


    /* Video current time */

    @state() private videoCurrentTime = NaN;

    private get videoCurrentTimeSafe()
    {
        return Number.isNaN(this.videoCurrentTime) ? 0 : this.videoCurrentTime;
    }


    /* Video duration */

    @state() private videoDuration = NaN;

    private get isVideoDurationFinite()
    {
        return Number.isFinite(this.videoDuration);
    }

    private get videoDurationSafe()
    {
        return this.isVideoDurationFinite ? this.videoDuration : 0;
    }


    // When relying solely on events and callbacks, progress bar does not
    // updates fast enough. This is a little helper that represent current
    // time ratio. It is updated more often than `videoTimeRatio`.
    @state() private _progressBarValue = 0;

    private get videoTimeRatio()
    {
        return getMediaTimeRatio(this.videoCurrentTime, this.videoDuration);
    }


    /* Is video paused */

    @state() private videoPaused = true;


    /* Video volume */

    private _videoVolumeInitialValue = 1;
    private _videoPreviousVolume = this._videoVolumeInitialValue;

    @state() private videoVolume = this._videoVolumeInitialValue;

    private toggleMute()
    {
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            video.muted = !video.muted
            if (video.muted)
            {
                this._videoPreviousVolume = this.videoVolume;
                video.volume = 0;
            }
            else
            {
                video.volume = this._videoPreviousVolume;
            }
        }
        else
        {
            console.error('Cannot toggle video volume: video element is undefined.');
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
            const currentTime = this.videoDurationSafe * Number(input.value);
            this._progressBarValue = getMediaTimeRatio(currentTime, this.videoDuration);
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
        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            video.volume = Number(input.value);
        }
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
                if (video) video.volume = Math.min(1, this.videoVolume + 0.1);
                break;
            }

            case 'ArrowDown':
            {
                ev.preventDefault();
                if (video) video.volume = Math.max(0, this.videoVolume - 0.1);
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

    private onMediaDurationChange = (ev: Event) =>
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.videoDuration = e.duration;
        this._progressBarValue = getMediaTimeRatio(e.currentTime, e.duration);
    };

    private onMediaPauseOrPlay = (ev: Event) =>
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.videoPaused = e.paused;
    };

    private onMediaTimeUpdate = (ev: Event) =>
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.videoCurrentTime = e.currentTime;
        this._progressBarValue = getMediaTimeRatio(e.currentTime, e.duration);
    };

    private onMediaVolumeChange = (ev: Event) =>
    {
        const e = ev.currentTarget as HTMLMediaElement;
        this.videoVolume = e.volume;
    };

    //#endregion



    //#region Main render

    override connectedCallback()
    {
        super.connectedCallback();
        window.addEventListener('keydown', this.handleKeyboardInput);

        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            video.addEventListener('durationchange', this.onMediaDurationChange);
            video.addEventListener('pause', this.onMediaPauseOrPlay);
            video.addEventListener('play', this.onMediaPauseOrPlay);
            video.addEventListener('timeupdate', this.onMediaTimeUpdate);
            video.addEventListener('volumechange', this.onMediaVolumeChange);
        }
        else
        {
            console.error('Cannot add event handlers in connected callback: video elemenet is undefined.');
        }
    }

    override disconnectedCallback()
    {
        window.removeEventListener('keydown', this.handleKeyboardInput);

        const video = this.videoElementRef?.value;
        if (video !== undefined)
        {
            video.removeEventListener('durationchange', this.onMediaDurationChange);
            video.removeEventListener('pause', this.onMediaPauseOrPlay);
            video.removeEventListener('play', this.onMediaPauseOrPlay);
            video.removeEventListener('timeupdate', this.onMediaTimeUpdate);
            video.removeEventListener('volumechange', this.onMediaVolumeChange);
        }
        else
        {
            console.error('Cannot remove event handlers in disconnected callback: video elemenet is undefined.');
        }

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
                    <time datetime=${toISODuration(this.videoDuration)}>
                        ${toHHMMSSDuration(this.videoDuration)}
                    </time>
                `;
            }

            return html`
                <div class="time">
                    <time datetime=${toISODuration(this.videoCurrentTimeSafe)}>
                        ${toHHMMSSDuration(this.videoCurrentTimeSafe)}
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
                    <time datetime=${toISODuration(this.videoCurrentTimeSafe)}>
                        ${toHHMMSSDuration(this.videoCurrentTimeSafe)}
                    </time>
                </div>
                <div class="input">
                    <div class="input-range">
                        <progress max="1" value=${this._progressBarValue}>
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
                    <time datetime=${toISODuration(this.videoDurationSafe)}>
                        ${toHHMMSSDuration(this.videoDurationSafe)}
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
                        title=${this.videoPaused ? 'Play' : 'Pause'}
                        @click=${this.onPlayButtonClick}
                    >
                        ${this.videoPaused
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
                        title=${this.videoVolume <= 0 ? 'Unmute' : 'Mute'}
                        @click=${this.toggleMute}
                    >
                        ${this.videoVolume <= 0
                            ? unsafeSVG(icon_volume_off)
                            : this.videoVolume > 0 && this.videoVolume < 0.5
                                ? unsafeSVG(icon_volume_low)
                                : unsafeSVG(icon_volume_high)}
                    </button>

                    <div class="volume-bar-wrapper">
                        <div class="volume-bar">
                            <div class="input-range">
                                <meter value=${this.videoVolume}>${this.videoVolume * 100}%</meter>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="any"
                                    .value=${this.videoVolume}
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
