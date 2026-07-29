<svelte:options
    // https://svelte.dev/docs/svelte/custom-elements#Component-options
    customElement={{
        tag: 'video-player',
        shadow: 'none',
        props: {
            hideProgress: {
                attribute: 'hideprogress',
                type: 'Boolean',
            },
        },
    }}
/>

<!-- #region Script
-->
<script lang="ts">
    import type { HTMLVideoAttributes } from 'svelte/elements';

    import Controls from './Controls.svelte';


    interface Props extends HTMLVideoAttributes {
        hideProgress?: boolean;
    }

    let {
        controls,
        preload,
        src,

        hideProgress = false,
    }: Props = $props();


    /** Binding to the wrapper element. */
    // svelte-ignore non_reactive_update <- DOM element does not need to be reactive??
    let wrapper: HTMLElement;
    /** Binding to the video element. */
    // svelte-ignore non_reactive_update
    let video: HTMLVideoElement;
    let canvas: HTMLElement;

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


    /** If video is currently paused. */
    let paused = $state(true);

    let duration = $state(0);
    let currentTime = $state(0);

    let volume = $state(1); // this is also default volume
    /** Is video currently muted. */
    let muted = $state(false);


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
        bind:currentTime
        bind:paused
        bind:volume
        bind:muted
        // readonly binds
        bind:duration

        {preload}
    >
        <source {src} />
        Your browser does not support HTML5 video.
    </video>

    <div bind:this={canvas} class="canvas"></div>

    {#if isControlsEnabled}
        <div
            class="controls-wrapper"

            style:visibility={isControlsVisible ? 'visible' : 'hidden'}
            style:opacity={isControlsVisible ? '1' : '0'}

            onmouseenter={() => _isMouseOverControls = true}
            onmouseleave={() => _isMouseOverControls = false}
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
