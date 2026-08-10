<svelte:options
    // https://svelte.dev/docs/svelte/custom-elements#Component-options
    customElement={{
        tag: 'video-player',
        shadow: 'open',
        props: {
            autoplay: {
                type: 'Boolean',
                reflect: true,
            },
            controls: {
                type: 'Boolean',
                reflect: true,
            },
            controlsList: {
                type: 'String',
                reflect: true,
            },
            src: {
                type: 'String',
                reflect: true,
            },
        },
        extend: (C) =>
        {
            return class extends C
            {
                constructor()
                {
                    super();
                }
            }
        },
    }}
/>

<script lang="ts">
    import type {
        CanvasElement,
        DisplayTiming,
        VideoPlayerMethods,
        VideoPlayerOptions,
        VideoPlayerProperties
    } from './types/global';
    import { canvasElementIDClassTemplate } from './shared.svelte';

    import Player from './Player.svelte';


    interface Props extends VideoPlayerProperties, VideoPlayerMethods {
        //
    }

    let {
        autoplay,
        controls,
        controlsList,
        src,
        addElementToCanvas,
        removeElementFromCanvas,
        clearCanvas,
    }: Props = $props();


    const hostElement = $host();

    const options = $state<VideoPlayerOptions>({
        controlsTimeout: 2000,
        cursorInactivityTimeout: 4000,

        playbackJumpValue: 5,
    });

    const canvasChildren = $state<CanvasElement[]>([]);

    addElementToCanvas = (e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id: string = crypto.randomUUID()) =>
    {
        e.classList.add(canvasElementIDClassTemplate + id);

        canvasChildren.push({
            e,
            id,
            dt,
            isMounted: false,
        });
    };

    removeElementFromCanvas = (id: string) =>
    {
        const i = canvasChildren.findIndex(e => e.id === id);
        if (i > -1)
        {
            canvasChildren.splice(i, 1);
        }
        else
        {
            console.warn(`Cannot find element with id "${id}" on canvas.`);
        }
    };

    clearCanvas = () =>
    {
        canvasChildren.length = 0;
    };
</script>



<Player
    {autoplay}
    {controls}
    {controlsList}
    {src}
    {hostElement}
    {options}
    {canvasChildren}
/>



<style></style>
