<svelte:options
    customElement={{
        tag: 'video-player',
        //shadow: 'none',
    }}
/>

<script lang="ts">
    import { formatVideoDuration, isNil, isNumber } from './lib/lib';

    import play from './assets/icons/videojs-v10/default/play.svg?raw';
    import pause from './assets/icons/videojs-v10/default/pause.svg?raw';
    import fullscreen_enter from './assets/icons/videojs-v10/default/fullscreen-enter.svg?raw';
    import fullscreen_exit from './assets/icons/videojs-v10/default/fullscreen-exit.svg?raw';


    interface Props {
        controls?: string;
        src?: string;
    }

    let {
        controls,
        src,
    }: Props = $props();


    /** Bind to the wrapper element. */
    let wrapper: HTMLElement;
    /** Bind to the video element. */
    let video = $state<HTMLVideoElement | null>(null);
    let controlsProgressBar = $state<HTMLElement | null>(null);

    let videoDuration = $state(0);
    let videoCurrentTime = $state(0);
    /** Number between 0 and 1 indicating progress on the video playback. */
    const videoCurrentTimeProgress = $derived.by(() =>
    {
        if (isNumber(videoCurrentTime)
            && isNumber(videoDuration)
            && videoCurrentTime >= 0
            && videoDuration > 0)
        {
            return videoCurrentTime / videoDuration;
        }

        return 0;
    });

    const isControlsEnabled = $derived(controls !== undefined);

    /** Is video currently is playing. */
    let isPlaying = $state(false);
    const togglePlayback = () =>
    {
        if (video === null)
        {
            console.error('Cannot toggle video playback: video element is undefined.');
            return;
        }

        if (isPlaying)
        {
            video.pause();
            isPlaying = false;
        }
        else
        {
            video.play();
            isPlaying = true;
        }
    };

    /** Is controls' progress bar currently being dragged. */
    let isDragging = $state(false);
    const updateProgressBar = (clientX: number) =>
    {
        if (controlsProgressBar === null) return;

        const rect = controlsProgressBar.getBoundingClientRect();

        let offsetX = clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));

        const percentage = offsetX / rect.width;
        videoCurrentTime = videoDuration * percentage;
    };

    /** Is video element currently in fullscreen. */
    let isFullscreen = $state(false);
    const toggleFullscreen = () =>
    {
        console.debug(isFullscreen ? 'Exiting fullscreen...' : 'Entering fullscreen...');

        if (document.fullscreenElement === null)
        {
            wrapper.requestFullscreen().catch((err) =>
            {
                isFullscreen = false;
                console.error(err);
            });

            isFullscreen = true;
        }
        else
        {
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
                togglePlayback();
                break;
            }

            case 'ArrowLeft':
            {
                ev.preventDefault();
                video.currentTime -= 5;
                break;
            }

            case 'ArrowRight':
            {
                ev.preventDefault();
                video.currentTime += 5;
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

    function windPlayback(t: number)
    {
        if (video !== null)
        {
            video.currentTime += t;
        }
        else
        {
            console.error('Cannot wind video playback: video element is undefined.');
        }
    }
</script>



<svelte:window
    onkeydown={handleKeyboardInput}

    onmousemove={(ev) =>
    {
        if (!isDragging) return;
        updateProgressBar(ev.clientX);
    }}
    onmouseup={() =>
    {
        isDragging = false;
    }}
    ontouchmove={(ev) =>
    {
        if (!isDragging) return;
        updateProgressBar(ev.touches[0].clientX);
    }}
    ontouchend={() =>
    {
        isDragging = false;
    }}
/>

<div
    bind:this={wrapper}
    class="__wrapper__"
>
    <video
        bind:this={video}
        bind:duration={videoDuration}
        bind:currentTime={videoCurrentTime}
    >
        <source {src} />
        Your browser does not support HTML5 video.
    </video>

    {#if isControlsEnabled}
        <div class="controls">
            <button
                class="button play"
                title={isPlaying ? 'Pause' : 'Play'}
                onclick={togglePlayback}
            >
                {#if isPlaying}
                    {@html pause}
                {:else}
                    {@html play}
                {/if}
            </button>

            <div
                class="progress"
                style:--progress="{videoCurrentTimeProgress * 100}%"
            >
                <div class="progress-time">{formatVideoDuration(videoCurrentTime)}</div>
                <button
                    bind:this={controlsProgressBar}
                    class="progress-bar"
                    aria-label="progress bar"
                    onmousedown={(ev) =>
                    {
                        isDragging = true;
                        updateProgressBar(ev.clientX);
                    }}
                    ontouchstart={(ev) =>
                    {
                        isDragging = true;
                        updateProgressBar(ev.touches[0].clientX);
                    }}
                >
                    <div class="progress-bar-handle"></div>
                </button>
                <div class="progress-time">{formatVideoDuration(videoDuration)}</div>
            </div>

            <!-- TODO: implement volume controls -->

            <button
                class="button fullscreen"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                onclick={toggleFullscreen}
            >
                {#if isFullscreen}
                    {@html fullscreen_exit}
                {:else}
                    {@html fullscreen_enter}
                {/if}
            </button>
        </div>
    {/if}
</div>



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

    .controls {
        position : absolute;
        bottom : 2%;
        left : 50%;
        transform : translateX(-50%);

        width : 60%;
        max-width : 60rem;
        padding : .25rem;

        display : flex;
        flex-wrap : nowrap;
        align-items : center;

        background-color : rgb(8 8 8);
        border : 1px solid rgb(255 255 255 / .3);
        border-radius : 999em;

        color : whitesmoke;
    }

    .controls > .button {
        height : 2rem;
        aspect-ratio : 1/1;
        padding : .33rem;

        background-color : transparent;
        border: none;
        border-radius : 999em;
        cursor : pointer;

        color : currentColor;
    }
    .controls > .button:hover {
        background-color : rgb(255 255 255 / .1);
    }
    .controls > .button > :global(svg) {
        width : 100%;
        height : 100%;

        display : block;
    }

    .controls > .progress {
        width : 100%;
        padding : 0 .67rem;

        display : flex;
        align-items : center;
        gap : .67rem;
    }
    .controls > .progress > .progress-time {
        /* fix wierd alignment? */
        padding-bottom : 1px;
    }
    .controls > .progress > .progress-bar {
        position : relative;

        width : 100%;
        height : 4px;

        background-color : currentColor;
        background-image : linear-gradient(
            to right,
            brown var(--progress, 0),
            transparent var(--progress, 0)
        );
        border : none;
        border-radius : 999em;
        cursor : pointer;

        color : inherit;
    }
    .controls > .progress > .progress-bar > .progress-bar-handle {
        position : absolute;
        top : 50%;
        left : var(--progress, 0);
        transform : translate(-50%, -50%);

        width : 12px;
        aspect-ratio : 1/1;

        background-color : currentColor;
        clip-path : circle(50%);
        cursor : pointer;
    }
</style>
