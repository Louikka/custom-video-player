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
    <progress max="1" {value}>{value * 100}%</progress>
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

    progress {
        width : 100%;
        height : 4px;
        margin : 0 calc(var(--thumb-size) / 2);

        appearance: none;
        background-color : currentcolor;
        border : none;
        border-radius : calc(infinity * 1px);

        color : inherit;
    }
    progress::-webkit-progress-bar {
        background-color : currentcolor;
        border-radius : calc(infinity * 1px);
    }
    progress::-webkit-progress-value {
        background-color : var(--video-player-accent-color, brown);
        border-radius : calc(infinity * 1px);
    }
    progress::-moz-progress-bar {
        background-color : var(--video-player-accent-color, brown);
        border-radius : calc(infinity * 1px);
    }

    input {
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
    input::-webkit-slider-thumb {
        width : var(--thumb-size);
        aspect-ratio : 1/1;

        appearance : none;
        background-color : currentcolor;
        border-radius : calc(infinity * 1px);
    }
    input::-moz-range-thumb {
        width : var(--thumb-size);
        height : var(--thumb-size);

        border : none;
    }
</style>
