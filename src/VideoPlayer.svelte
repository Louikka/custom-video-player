<svelte:options
    // https://svelte.dev/docs/svelte/custom-elements#Component-options
    customElement={{
        tag: 'video-player',
        shadow: 'open',
        props: {
            controls: {
                type: 'Boolean',
            },
            src: {
                type: 'String',
            },
            hideProgress: {
                type: 'Boolean',
            },
        },
    }}
/>

<!-- #region Script
-->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { HTMLVideoAttributes } from 'svelte/elements';
    import { isNil } from './lib/lib';
    import { canvasElements, videoPlayerOptions } from './lib/shared.svelte';

    import Controls from './Controls.svelte';
    import { manageCanvasElementsOnTimeupdate } from './lib/helpers';


    interface Props extends HTMLVideoAttributes {
        hideProgress?: boolean;
    }

    let {
        controls,
        src,

        hideProgress = false,

        ...rest
    }: Props = $props();


    /** Binding to the wrapper element. */
    // svelte-ignore non_reactive_update <- DOM element does not need to be reactive??
    let wrapper: HTMLElement;
    /** Binding to the video element. */
    // svelte-ignore non_reactive_update
    let video: HTMLVideoElement;
    let canvas: HTMLElement;


    let isMouseOverWrapper = $state(false);
    let isMouseOverControls = $state(false);

    let _showControlsOnLoad = $state(true);
    let _isControlsTimedOut = $state(false);

    const isControlsEnabled = $derived(!isNil(controls) && controls);
    const isControlsVisible = $derived.by(() =>
    {
        if (_showControlsOnLoad) return true;
        if (isMouseOverControls) return true;
        if (_isControlsTimedOut) return false;
        return true;
    });

    let _controlsTimeoutTimerID: number | undefined = undefined;
    const handleControlsTimeout = () =>
    {
        clearTimeout(_controlsTimeoutTimerID);

        if (isMouseOverWrapper)
        {
            _isControlsTimedOut = false;

            _controlsTimeoutTimerID = setTimeout(() =>
            {
                _isControlsTimedOut = true;
            }, videoPlayerOptions.controlsTimeout);
        }
        else
        {
            _isControlsTimedOut = true;
        }
    };

    /** Controls if cursor should be hidden or not (typically, after a period of inactivity). */
    let isCursorHidden = $state(false);

    let _cursorTimeoutTimerID: number | undefined = undefined;
    const handleCursorIdling = () =>
    {
        isCursorHidden = false;

        clearTimeout(_cursorTimeoutTimerID);

        _cursorTimeoutTimerID = setTimeout(() =>
        {
            isCursorHidden = true;
        }, videoPlayerOptions.cursorInactivityTimeout);
    };


    /** If video is currently paused. */
    let paused = $state(true);

    let duration = $state(0);
    let currentTime = $state(0);

    let volume = $state(1); // this is also default volume
    /** Is video currently muted. */
    let muted = $state(false);



    onMount(() =>
    {
        // fix slotted content
        document.addEventListener('DOMContentLoaded', () =>
        {
            video.append(...$host().children);
        });
    });
</script>
<!-- #endregion -->



<!-- #region HTML
-->
<svelte:window
    onmousemove={() =>
    {
        handleControlsTimeout();
        handleCursorIdling();
    }}

    onmousedown={() =>
    {
        handleCursorIdling();
    }}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    bind:this={wrapper}
    class="__wrapper__"

    aria-label="video player"

    style:cursor={isCursorHidden ? 'none' : null}

    onmouseenter={() => (_showControlsOnLoad = false, isMouseOverWrapper = true)}
    onmouseleave={() => isMouseOverWrapper = false}
>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
        bind:this={video}
        // https://svelte.dev/docs/svelte/bind#audio
        // two-way binds
        bind:currentTime
        bind:paused
        bind:volume
        bind:muted
        // readonly binds
        bind:duration

        {src}

        {...rest}

        ontimeupdate={(ev) =>
        {
            manageCanvasElementsOnTimeupdate(ev, canvas, canvasElements);
        }}
    >
        <slot>dummy</slot>
    </video>

    <div bind:this={canvas} class="canvas"></div>

    {#if isControlsEnabled}
        <div
            class="controls-wrapper"

            style:visibility={isControlsVisible ? 'visible' : 'hidden'}
            style:opacity={isControlsVisible ? '1' : '0'}

            onmouseenter={() => isMouseOverControls = true}
            onmouseleave={() => isMouseOverControls = false}
        >
            <Controls
                wrapperElement={wrapper}
                videoElement={video}
                {duration}
                bind:currentTime
                bind:paused
                bind:volume
                bind:muted
                isProgressDisabled={hideProgress}
            />
        </div>
    {/if}
</div>
<!-- #endregion -->



<!-- #region Styles
-->
<style>
    /* Element can be customized via custom CSS custom properties. */

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

    .canvas {
        position : absolute;
        top : 0;
        left : 0;

        width : 100%;
        height : 100%;
    }

    .controls-wrapper {
        position : absolute;
        bottom : 0;
        left : 50%;
        transform : translateX(-50%);

        width : 70%;
        max-width : 80rem;
        padding : 1% 2%;

        transition :
            visibility .1s ease,
            opacity .1s ease;
    }
</style>
<!-- #endregion -->
