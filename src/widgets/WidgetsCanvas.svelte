<script lang="ts">
    import { onMount } from 'svelte';
    import type { Action, Script } from './widgets';
    import { checkScript, getFadeTimingFunction, isStartLabel, shouldDisplayWidget } from './helpers';
    import { fade, type FadeParams } from 'svelte/transition';


    interface Props {
        videoCurrentTime: number;
        script: Script;
    }

    let {
        videoCurrentTime = $bindable(),
        script,
    }: Props = $props();


    $effect(() =>
    {
        checkScript(script);
    });

    export const CANVAS_UID = $props.id();


    onMount(() =>
    {
        const styleDeclarations = script.declarations?.filter(decl => decl.type === 'DECL_STYLE');
        if (styleDeclarations !== undefined)
        {
            const style = document.createElement('style');

            for (const decl of styleDeclarations)
            {
                style.textContent += `.__style_decl-${CANVAS_UID}-${decl.name}__ {${decl.style}}`;
            }

            document.head.append(style);
        }

        // set starting point if available
        if (script.declarations !== undefined)
        {
            const startLabelWidget = script.declarations.find(isStartLabel);
            if (startLabelWidget !== undefined)
            {
                videoCurrentTime = startLabelWidget.timestamp ?? 0;
            }
        }
    });



    function executeWidgetActions(actions: Action | Action[])
    {
        const a: Action[] = [];

        if (Array.isArray(actions))
        {
            a.push(...actions);
        }
        else
        {
            a.push(actions);
        }

        for (const action of a)
        {
            switch (action.type)
            {
                case 'ACT_JUMP':
                {
                    videoCurrentTime = action.to;
                    break;
                }
            }
        }
    }
</script>



{#each script.widgets as w}
    {#if shouldDisplayWidget(videoCurrentTime, w.display)}
        {const styleClasses =
            w.use_style_decl?.map(declName => `__style_decl-${CANVAS_UID}-${declName}__`).join(' ') ?? ''}

        {const effFadeOptions: FadeParams = {
            duration: w.effects?.fade?.duration ?? 0,
            delay: w.effects?.fade?.delay ?? 0,
            easing: getFadeTimingFunction(w.effects?.fade?.timing_func ?? 'linear'),
        }}

        {#if w.type === 'WIDG_TEXT'}
            <span
                class="__widget-{CANVAS_UID}__ {styleClasses}"

                style={w.style}

                style:position="absolute"
                style:top={(w.position.y * 100) + '%'}
                style:left={(w.position.x * 100) + '%'}

                transition:fade|global={effFadeOptions}
            >{w.text}</span>
        {:else if w.type === 'WIDG_BUTTON'}
            <button
                class="__widget-{CANVAS_UID}__ {styleClasses}"

                style={w.style}

                style:position="absolute"
                style:top={(w.position.y * 100) + '%'}
                style:left={(w.position.x * 100) + '%'}

                transition:fade={effFadeOptions}

                onclick={() => executeWidgetActions(w.onclick ?? []) }
            >{w.text}</button>
        {/if}
    {/if}
{/each}



<style>
    button:not(:disabled) {
        cursor : pointer;
    }
</style>
