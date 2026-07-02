<script lang="ts">
    import { onMount } from 'svelte';
    import { isTimeInTimeframe } from './lib/lib';
    import type { Action, Script } from './specs/widgets';
    import { isStartLabel } from './specs/helpers';


    interface Props {
        videoCurrentTime: number;
        script: Script;
    }

    let {
        videoCurrentTime = $bindable(),
        script,
    }: Props = $props();


    export const CANVAS_UID = $props.id();


    onMount(() =>
    {
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
    {#if isTimeInTimeframe(videoCurrentTime, { start: w.display.show, end: w.display.hide })}

        {#if w.type === 'WIDG_BUTTON'}
            <button
                class="__ivc-widget-{CANVAS_UID}__ {w.use_style_decl}"

                style={w.style}

                style:position="absolute"
                style:top={(w.position.y * 100) + '%'}
                style:left={(w.position.x * 100) + '%'}

                onclick={() => executeWidgetActions(w.onclick ?? []) }
            >{w.text}</button>
        {/if}

    {/if}
{/each}
