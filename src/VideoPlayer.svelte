<svelte:options
    customElement={{
        tag: 'video-player',
        shadow: 'none',
    }}
/>

<!-- #region Script
-->
<script lang="ts">
    import { fade } from 'svelte/transition';

    import { formatMediaPreload, formatVideoDuration, getMediaTimeRatio, togglePlayback } from './lib/lib';
    import { parseScript } from './widgets/helpers';

    import InputRange from './lib/InputRange.svelte';
    import WidgetsCanvas from './widgets/WidgetsCanvas.svelte';

    import icon_play from './assets/icons/videojs-v10/default/play.svg?raw';
    import icon_pause from './assets/icons/videojs-v10/default/pause.svg?raw';
    import icon_volume_off from './assets/icons/videojs-v10/default/volume-off.svg?raw';
    import icon_volume_low from './assets/icons/videojs-v10/default/volume-low.svg?raw';
    import icon_volume_high from './assets/icons/videojs-v10/default/volume-high.svg?raw';
    import icon_fullscreen_enter from './assets/icons/videojs-v10/default/fullscreen-enter.svg?raw';
    import icon_fullscreen_exit from './assets/icons/videojs-v10/default/fullscreen-exit.svg?raw';


    interface Props {
        // native api
        controls?: string | 'hideprogress';
        preload?: string;
        src?: string;

        // custom
        script?: string;
    }

    let {
        controls,
        preload = formatMediaPreload(),
        src,
        script,
    }: Props = $props();


    /** Binding to the wrapper element. */
    let wrapper: HTMLElement;
    /** Binding to the video element. */
    let video: HTMLVideoElement;

    let _isMouseOverWrapper = $state(false);
    let _showControlsOnLoad = $state(true);
    let _isMouseOverControls = $state(false);
    let _isControlsTimedOut = $state(false);
    let _mouseMovementTimerId = 0;

    const isControlsEnabled = $derived(controls !== undefined);
    const isControlsVisible = $derived.by(() =>
    {
        if (_showControlsOnLoad) return true;
        if (_isMouseOverControls) return true;
        if (_isControlsTimedOut) return false;
        return true;
    });

    /**
     * If `true`, then all progress-related functions (such as actual progress
     * bar of fast-forward key bindings) should be disabled.
     */
    const isProgressDisabled = $derived(controls === 'hideprogress');

    const parsedScript = $derived.by(() =>
    {
        if (script === undefined) return null;

        let parsed = null;

        try
        {
            parsed = parseScript(script);
        }
        catch (err)
        {
            console.error(err);
        }

        return parsed;
    });


    /** If video is currently paused. */
    let isPaused = $state(true);

    let videoDuration = $state(0);
    const videoDurationSafe = $derived(Number.isFinite(videoDuration) ? videoDuration : 0);
    let videoCurrentTime = $state(0);
    const videoCurrentTimeSafe = $derived(Number.isNaN(videoCurrentTime) ? videoCurrentTime : 0);
    /** Number between 0 and 1 indicating progress on the video playback. */
    const videoCurrentTimeProgress = $derived(getMediaTimeRatio(videoCurrentTime, videoDuration));

    let videoVolume = $state(1); // this is also default volume
    /** Is video currently muted. */
    let isMuted = $derived(videoVolume <= 0);
    // svelte-ignore state_referenced_locally
    let _previousVideoVolume = videoVolume; // get initial value
    const toggleMute = () =>
    {
        if (isMuted)
        {
            videoVolume = _previousVideoVolume;
        }
        else
        {
            _previousVideoVolume = videoVolume;
            videoVolume = 0;
        }
    };

    /** Is video element currently in fullscreen. */
    let isFullscreen = $state(false);
    const toggleFullscreen = async () =>
    {
        console.debug(isFullscreen ? 'Exiting fullscreen...' : 'Entering fullscreen...');

        if (document.fullscreenElement === null)
        {
            try
            {
                await wrapper.requestFullscreen();
                isFullscreen = true;
            }
            catch (err)
            {
                console.error(err);
                isFullscreen = false;
            }
        }
        else
        {
            // also async and can reject, but its fine?
            // (possible) todo: handle error
            document.exitFullscreen();
            isFullscreen = false;
        }
    };

    const handleKeyboardInput = (ev: KeyboardEvent) =>
    {
        if (video === null) return;

        switch (ev.key)
        {
            case ' ':
            {
                togglePlayback(video);
                break;
            }

            case 'ArrowLeft':
            {
                ev.preventDefault();

                if (!isProgressDisabled)
                {
                    video.currentTime -= 5;
                }

                break;
            }

            case 'ArrowRight':
            {
                ev.preventDefault();

                if (!isProgressDisabled)
                {
                    video.currentTime += 5;
                }

                break;
            }

            case 'ArrowUp':
            {
                ev.preventDefault();
                video.volume = Math.min(1, video.volume + 0.1);
                break;
            }

            case 'ArrowDown':
            {
                ev.preventDefault();
                video.volume = Math.max(0, video.volume - 0.1);
                break;
            }

            case 'f':
            case 'F':
            {
                toggleFullscreen();
                break;
            }

            case 'm':
            case 'M':
            {
                video.muted = !video.muted;
                break;
            }
        }
    };
    const handleMouseMove = (ev: MouseEvent) =>
    {
        if (_isMouseOverWrapper)
        {
            _isControlsTimedOut = false;
            clearTimeout(_mouseMovementTimerId);
            _mouseMovementTimerId = setTimeout(() =>
            {
                _isControlsTimedOut = true;
            }, 2000); // timeout for hiding controls
        }
        else
        {
            clearTimeout(_mouseMovementTimerId);
            _isControlsTimedOut = true;
        }
    };
</script>
<!-- #endregion -->



<!-- #region HTML
-->
<svelte:window
    onkeydown={handleKeyboardInput}
    onmousemove={handleMouseMove}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    bind:this={wrapper}
    class="__wrapper__"

    aria-label="video player"

    onmouseenter={() => (_showControlsOnLoad = false, _isMouseOverWrapper = true)}
    onmouseleave={() => _isMouseOverWrapper = false}
>
    <video
        bind:this={video}
        // https://svelte.dev/docs/svelte/bind#audio
        // two-way binds
        bind:currentTime={videoCurrentTime}
        bind:paused={isPaused}
        bind:volume={videoVolume}
        bind:muted={isMuted}
        // readonly binds
        bind:duration={videoDuration}

        preload={formatMediaPreload(preload)}
    >
        <source {src} />
        Your browser does not support HTML5 video.
    </video>

    {#if parsedScript !== null}
        <WidgetsCanvas bind:videoCurrentTime script={parsedScript} />
    {/if}

    {#if isControlsEnabled && isControlsVisible}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="controls-wrapper"

            onmouseenter={() => _isMouseOverControls = true}
            onmouseleave={() => _isMouseOverControls = false}

            transition:fade={{
                duration: 90,
            }}
        >
            <div class="controls">
                <button
                    class="button"
                    title={isPaused ? 'Play' : 'Pause'}
                    onclick={() => togglePlayback(video) }
                >
                    {#if isPaused}
                        {@html icon_play}
                    {:else}
                        {@html icon_pause}
                    {/if}
                </button>

                <div class="progress-bar">
                    {#if isProgressDisabled}
                        <div class="time">
                            {formatVideoDuration(videoCurrentTimeSafe)}
                            {#if Number.isFinite(videoDurationSafe)}
                                <span>/ {formatVideoDuration(videoDurationSafe)}</span>
                            {/if}
                        </div>
                        <div style="flex-grow:1"></div>
                    {:else}
                        <div class="time">{formatVideoDuration(videoCurrentTimeSafe)}</div>
                        <div class="input">
                            <InputRange
                                value={videoCurrentTimeProgress}
                                onupdate={(v) =>
                                {
                                    if (video === null) return;
                                    video.currentTime = videoDurationSafe * v;
                                }}
                            />
                        </div>
                        <div class="time">{formatVideoDuration(videoDurationSafe)}</div>
                    {/if}
                </div>

                <div class="volume">
                    <button
                        class="button"
                        title={isMuted ? 'Unmute' : 'Mute'}
                        onclick={toggleMute}
                    >
                        {#if videoVolume > 0.5}
                            {@html icon_volume_high}
                        {:else if videoVolume < 0.5 && videoVolume > 0}
                            {@html icon_volume_low}
                        {:else}
                            {@html icon_volume_off}
                        {/if}
                    </button>

                    <div class="volume-bar-wrapper">
                        <div class="volume-bar">
                            <InputRange
                                bind:value={videoVolume}
                                orientation="vertical"
                            />
                        </div>
                    </div>
                </div>

                <button
                    class="button"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    onclick={toggleFullscreen}
                >
                    {#if isFullscreen}
                        {@html icon_fullscreen_exit}
                    {:else}
                        {@html icon_fullscreen_enter}
                    {/if}
                </button>
            </div>
        </div>
    {/if}
</div>
<!-- #endregion -->



<!-- #region Styles
-->
<style>
    .__wrapper__ {
        position : relative;

        width : 100%;
        height : 100%;

        display : block;

        font-family :
            system-ui,
            'Segoe UI',
            Roboto,
            Helvetica,
            Arial,
            sans-serif,
            'Apple Color Emoji',
            'Segoe UI Emoji';
        line-height : 1.15;
        -webkit-text-size-adjust : 100%;
    }

    video {
        width : 100%;
        height : 100%;

        display : block;
    }

    .controls-wrapper {
        position : absolute;
        bottom : 0;
        left : 50%;
        transform : translateX(-50%);

        width : 70%;
        max-width : 80rem;
        padding : 1% 2%;
    }

    .controls {
        width : 100%;
        padding : .25rem;

        display : flex;
        gap : .2rem;
        flex-wrap : nowrap;
        align-items : center;

        background-color : rgb(8 8 8);
        border : 1px solid rgb(255 255 255 / .3);
        border-radius : 999em;

        color : whitesmoke;
    }

    .controls .button {
        height : 2rem;
        aspect-ratio : 1/1;
        padding : .33rem;

        background-color : transparent;
        border: none;
        border-radius : 999em;
        cursor : pointer;

        color : currentColor;
    }
    .controls .button:hover {
        background-color : rgb(255 255 255 / .1);
    }
    .controls .button > :global(svg) {
        width : 100%;
        height : 100%;

        display : block;
    }

    .controls > .progress-bar {
        width : 100%;
        padding : 0 .5rem;

        display : flex;
        align-items : center;
        gap : .67rem;
    }
    .controls > .progress-bar > .time {
        /* fix wierd alignment? */
        padding-bottom : 1px;
    }
    .controls > .progress-bar > .input {
        width : 100%;
    }

    .controls > .volume {
        position : relative;

        border-radius : 999em;
    }
    .controls > .volume .button {
        position : relative;
        z-index : 1;
    }
    .controls > .volume .volume-bar-wrapper {
        position : absolute;
        top : 20%;
        left : 50%;
        transform : translateY(-50%) rotate(-90deg);
        transform-origin : center left;
        padding : .4rem 1.1rem;

        display : none;
    }
    .controls > .volume:hover .volume-bar-wrapper {
        display : initial;
    }
    .controls > .volume .volume-bar {
        width : 100px;
        height : 30px;
        padding : 0 .9rem;

        background-color : rgb(8 8 8);
        border : 1px solid rgb(255 255 255 / .3);
        border-radius : 999em;
    }
</style>
<!-- #endregion -->
