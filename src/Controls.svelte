<!-- #region Script
-->
<script lang="ts">
    import { toggleFullscreen } from './lib/lib';
    import { togglePlayback, getMediaTimeRatio, formatMediaDuration } from './lib/media_helpers';
    import { videoPlayerOptions } from './lib/shared.svelte';

    import InputRange from './Components/InputRange.svelte';

    import icon_play from './assets/icons/videojs-v10/default/play.svg?raw';
    import icon_pause from './assets/icons/videojs-v10/default/pause.svg?raw';
    import icon_volume_off from './assets/icons/videojs-v10/default/volume-off.svg?raw';
    import icon_volume_low from './assets/icons/videojs-v10/default/volume-low.svg?raw';
    import icon_volume_high from './assets/icons/videojs-v10/default/volume-high.svg?raw';
    import icon_fullscreen_enter from './assets/icons/videojs-v10/default/fullscreen-enter.svg?raw';
    import icon_fullscreen_exit from './assets/icons/videojs-v10/default/fullscreen-exit.svg?raw';


    interface Props {
        readonly wrapperElement: HTMLElement;
        readonly videoElement: HTMLVideoElement;

        readonly duration: number;
        currentTime: number;
        paused: boolean;
        volume: number;
        muted: boolean;

        isProgressDisabled?: boolean;
    }

    let {
        wrapperElement,
        videoElement,

        duration,
        currentTime = $bindable(),
        paused = $bindable(),
        volume = $bindable(),
        muted = $bindable(),

        isProgressDisabled = false,
    }: Props = $props();


    const durationSafe = $derived(Number.isFinite(duration) ? duration : 0);
    const currentTimeSafe = $derived(Number.isNaN(currentTime) ? 0 : currentTime);

    let _previousVolume = volume; // get initial value
    $effect(() => { muted = volume <= 0 });
    const toggleMute = () =>
    {
        if (muted)
        {
            muted = false;
            volume = _previousVolume;
        }
        else
        {
            muted = true;
            _previousVolume = volume;
            volume = 0;
        }
    };

    let isFullscreen = $state(false);


    const handleKeyboardInput = (ev: KeyboardEvent) =>
    {
        switch (ev.key)
        {
            case ' ':
            {
                togglePlayback(videoElement);
                break;
            }

            case 'ArrowLeft':
            {
                ev.preventDefault();

                if (!isProgressDisabled)
                {
                    currentTime -= videoPlayerOptions.jumpValue;
                }

                break;
            }

            case 'ArrowRight':
            {
                ev.preventDefault();

                if (!isProgressDisabled)
                {
                    currentTime += videoPlayerOptions.jumpValue;
                }

                break;
            }

            case 'ArrowUp':
            {
                ev.preventDefault();
                volume = Math.min(1, volume + 0.1);
                break;
            }

            case 'ArrowDown':
            {
                ev.preventDefault();
                volume = Math.max(0, volume - 0.1);
                break;
            }

            case 'f':
            case 'F':
            {
                toggleFullscreen(wrapperElement).then(v => isFullscreen = v);
                break;
            }

            case 'm':
            case 'M':
            {
                toggleMute();
                break;
            }
        }
    };
</script>
<!-- #endregion -->



<!-- #region HTML
-->
<svelte:window
    onkeydown={handleKeyboardInput}
/>

<div class="controls">
    <div class="play">
        <button
            class="button"
            title={paused ? 'Play' : 'Pause'}
            onclick={() => togglePlayback(videoElement) }
        >
            {#if paused}
                {@html icon_play}
            {:else}
                {@html icon_pause}
            {/if}
        </button>
    </div>

    <div class="progress">
        {#if isProgressDisabled}
            <div class="time">
                {formatMediaDuration(currentTimeSafe)}
                {#if Number.isFinite(durationSafe)}
                    <span>/ {formatMediaDuration(durationSafe)}</span>
                {/if}
            </div>
            <div style="flex-grow:1"></div>
        {:else}
            <div class="time">{formatMediaDuration(currentTimeSafe)}</div>
            <div class="input">
                <InputRange
                    value={getMediaTimeRatio(currentTimeSafe, durationSafe)}
                    onupdate={(v) =>
                    {
                        currentTime = durationSafe * v;
                    }}
                />
            </div>
            <div class="time">{formatMediaDuration(durationSafe)}</div>
        {/if}
    </div>

    <div class="volume">
        <button
            class="button"
            title={muted ? 'Unmute' : 'Mute'}
            onclick={toggleMute}
        >
            {#if muted}
                {@html icon_volume_off}
            {:else}
                {#if volume > 0.5}
                    {@html icon_volume_high}
                {:else if volume < 0.5 && volume > 0}
                    {@html icon_volume_low}
                {:else}
                    {@html icon_volume_off}
                {/if}
            {/if}
        </button>

        <div class="volume-bar-wrapper">
            <div class="volume-bar">
                <InputRange bind:value={volume} />
            </div>
        </div>
    </div>

    <div class="c">
        <button
            class="button"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onclick={async () => isFullscreen = await toggleFullscreen(wrapperElement) }
        >
            {#if isFullscreen}
                {@html icon_fullscreen_exit}
            {:else}
                {@html icon_fullscreen_enter}
            {/if}
        </button>
    </div>
</div>
<!-- #endregion -->



<!-- #region Styles
-->
<style>
    .controls {
        width : 100%;
        padding : .25rem;

        display : flex;
        gap : .2rem;
        flex-wrap : nowrap;
        align-items : center;

        background-color : var(--video-player-bg, rgb(8 8 8));
        border : 1px solid var(--video-player-border, rgb(255 255 255 / .3));
        border-radius : calc(infinity * 1px);

        color : var(--video-player-color, whitesmoke);
    }


    .controls .button {
        height : 2rem;
        aspect-ratio : 1/1;
        padding : .33rem;

        background-color : transparent;
        border: none;
        border-radius : calc(infinity * 1px);
        cursor : pointer;

        color : currentcolor;
    }
    .controls .button:hover {
        background-color : var(--video-player-bg-hover, rgb(255 255 255 / .1));
    }
    .controls .button > :global(svg) {
        width : 100%;
        height : 100%;

        display : block;
    }


    .controls > .play {
        display : flex;
        flex-wrap : nowrap;
        align-items : center;
    }

    .controls > .progress {
        width : 100%;
        padding : 0 .333rem;

        display : flex;
        align-items : center;
        gap : .333rem;
    }
    .controls > .progress > .time {
        /* fix wierd alignment? */
        padding-bottom : 1px;
    }
    .controls > .progress > .input {
        width : 100%;
    }

    .controls > .volume {
        position : relative;

        border-radius : calc(infinity * 1px);
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

        padding : .5rem .5rem .5rem 1.25rem;

        display : none;
    }
    .controls > .volume:hover .volume-bar-wrapper {
        display : initial;
    }
    .controls > .volume .volume-bar {
        width : 100px;
        height : 30px;
        padding : 0 .6rem;

        background-color : var(--video-player-bg, rgb(8 8 8));
        border : 1px solid var(--video-player-border, rgb(255 255 255 / .3));
        border-radius : calc(infinity * 1px);
    }

    .controls > .c {
        display : flex;
        flex-wrap : nowrap;
        align-items : center;
    }
</style>
<!-- #endregion -->
