<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';


    interface Props extends HTMLInputAttributes {
        value: number; // narrow value type since components tries to mimic input with type="range"

        /** This function runs every time the value is manually updated. */
        onupdate?: (value: number) => void;
    }

    let {
        value = $bindable(0),
        onupdate,
    }: Props = $props();
</script>



<div class="__wrapper__">
    <!-- TODO: switch to html progress element -->
    <div class="progress" style:--value="{value * 100}%"></div>
    <input
        class="input"
        type="range"
        min="0"
        max="1"
        step="any"
        bind:value
        oninput={() => onupdate?.(value) }
    />
</div>



<style>
    .__wrapper__ {
        --thumb-size : 12px;

        position: relative;

        width : 100%;
        height : 100%;

        display : flex;
        align-items : center;
    }

    .progress {
        width : 100%;
        height : 4px;
        margin : 0 calc(var(--thumb-size) / 2);

        background-color : currentcolor;
        background-image : linear-gradient(
            to right,
            var(--video-player-accent-color, brown) var(--value, 0),
            transparent var(--value, 0)
        );
        border : none;
        border-radius : calc(infinity * 1px);
        cursor : pointer;

        color : inherit;
    }
    .input {
        position : absolute;
        top : 50%;
        left : 0;
        transform : translateY(-50%);

        width : 100%;

        appearance : none;
        background-color : transparent;
        outline : none;
        cursor : pointer;

        color : inherit;
    }
    .input::-webkit-slider-thumb {
        width : var(--thumb-size);
        aspect-ratio : 1/1;

        appearance : none;
        background-color : currentcolor;
        border-radius : calc(infinity * 1px);
    }
</style>
