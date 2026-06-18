<script lang="ts">
    interface Props {
        /** Number between 0 and 1. */
        value?: number;
        /** This function runs every time the value is manually updated. */
        onupdate?: (value: number) => void;
        orientation?: 'horizontal' | 'vertical';
    }

    let {
        value = $bindable(0),
        onupdate,
        orientation = 'horizontal',
    }: Props = $props();


    let e: HTMLElement;

    /** If currently being dragged. */
    let isDragging = $state(false);

    const update = (ev: MouseEvent | Touch) =>
    {
        const rect = e.getBoundingClientRect();

        if (orientation === 'horizontal')
        {
            let offsetX = ev.clientX - rect.left;
            offsetX = Math.max(0, Math.min(offsetX, rect.width));
            value = offsetX / rect.width;
        }
        else if (orientation === 'vertical')
        {
            let offsetY = rect.bottom - ev.clientY;
            offsetY = Math.max(0, Math.min(offsetY, rect.height));
            value = offsetY / rect.height;
        }
        else
        {
            return;
        }

        if (onupdate !== undefined) onupdate(value);
    };
</script>



<svelte:window
    onmousemove={(ev) =>
    {
        if (!isDragging) return;
        update(ev);
    }}
    onmouseup={() =>
    {
        isDragging = false;
    }}
    ontouchmove={(ev) =>
    {
        if (!isDragging) return;
        update(ev.touches[0]);
    }}
    ontouchend={() =>
    {
        isDragging = false;
    }}
/>

<div class="__wrapper__">
    <button
        bind:this={e}

        class="custom-input-range"

        aria-label="range input"

        style:--value="{value * 100}%"

        onmousedown={(ev) =>
        {
            isDragging = true;
            update(ev);
        }}
        ontouchstart={(ev) =>
        {
            isDragging = true;
            update(ev.touches[0]);
        }}
    >
        <div class="custom-input-range-handle"></div>
    </button>
</div>



<style>
    .__wrapper__ {
        width : 100%;
        height : 100%;

        display : flex;
        align-items : center;
    }

    .custom-input-range {
        position : relative;

        width : 100%;
        height : 4px;

        background-color : currentColor;
        background-image : linear-gradient(
            to right,
            brown var(--value, 0),
            transparent var(--value, 0)
        );
        border : none;
        border-radius : 999em;
        cursor : pointer;

        color : inherit;
    }
    .custom-input-range > .custom-input-range-handle {
        position : absolute;
        top : 50%;
        left : var(--value, 0);
        transform : translate(-50%, -50%);

        width : 12px;
        aspect-ratio : 1/1;

        background-color : currentColor;
        clip-path : circle(50%);
        cursor : pointer;
    }
</style>
