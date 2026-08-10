<svelte:options
    // https://svelte.dev/docs/svelte/custom-elements#Component-options
    customElement={{
        tag: 'video-player',
        shadow: 'open',
        props: {},
        extend: (C) =>
        {
            return class extends C implements VideoPlayerExtendClassInterface
            {
                constructor()
                {
                    super();
                }


                public addElementToCanvas(e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id: string = crypto.randomUUID())
                {
                    e.classList.add(canvasElementIDClassTemplate + id);

                    instanceState.canvas.children.push({
                        e,
                        id,
                        dt,
                        isMounted: false,
                    });
                }

                public removeElementFromCanvas(id: string)
                {
                    const i = instanceState.canvas.children.findIndex(e => e.id === id);
                    if (i > -1)
                    {
                        instanceState.canvas.children.splice(i, 1);
                    }
                    else
                    {
                        console.warn(`Cannot find element with id "${id}" on canvas.`);
                    }
                }

                public clearCanvas()
                {
                    instanceState.canvas.children.length = 0;
                }
            }
        },
    }}
/>

<script lang="ts">
    import type { HTMLVideoAttributes } from 'svelte/elements';
    import type { CanvasElement, DisplayTiming, VideoPlayerExtendClassInterface } from './types/global';
    import { canvasElementIDClassTemplate } from './shared.svelte';

    //import Wrapper from './Wrapper.svelte';


    // interface VideoProps extends HTMLVideoAttributes {
    //     controlsList: HTMLVideoAttributes['controlslist'];
    //     crossOrigin: HTMLVideoAttributes['crossorigin'];
    //     disablePictureInPicture: HTMLVideoAttributes['disablepictureinpicture'];
    //     disableRemotePlayback: HTMLVideoAttributes['disableremoteplayback'];
    // }

    interface _MediaAttributes {
        src?: HTMLVideoAttributes['src'];
    }

    interface Props extends _MediaAttributes {
        //
    }

    let {
        // autoplay,
        // controls,
        // controlsList,
        // crossOrigin,
        // disablePictureInPicture,
        // disableRemotePlayback,
        // //loading,
        // loop,
        // muted,
        // poster,
        // preload,
        src,
    }: Props = $props();


    export interface InternalState {
        wrapper: {
            e?: HTMLElement;
        };

        video: _MediaAttributes & {
            e?: HTMLVideoElement;
        };

        canvas: {
            e?: HTMLElement;
            children: CanvasElement[];
        };

        controls: {
            e?: HTMLElement;
        };
    }

    let instanceState = $derived<InternalState>({
        wrapper: {},
        video: {
            // autoplay,
            // controls,
            // controlsList,
            // crossOrigin,
            // disablePictureInPicture,
            // disableRemotePlayback,
            // loop,
            // muted,
            // poster,
            // preload,
            src,
        },
        canvas: {
            children: [],
        },
        controls: {},
    });
</script>



<!-- <Wrapper bind:instanceState /> -->



<style></style>
