import type { Component } from 'svelte';


export interface VideoPlayerExtendClassInterface {
    /**
     * @param e element that should be displayed on canvas.
     * @param dt timings to display element.
     * @param id optional ID for element (required to be able to delete element from canvas).
     */
    public addElementToCanvas(e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id?: string): void;

    public removeElementFromCanvas(id: string): void;

    public clearCanvas(): void;
}

export type VideoPlayerElement = HTMLElement & NonNullable<Component['element']> & VideoPlayerExtendClassInterface;


export interface DisplayTiming {
    /** Timestamp (in seconds) when element should be shown. */
    showAt: number;
    /** Timestamp (in seconds) past which element should be hidden. */
    hideAt: number;
}

export interface CanvasElement {
    /** Element that should be displayed on canvas. */
    e: HTMLElement;
    id: string;
    /** Display timing. */
    dt: DisplayTiming | Array<DisplayTiming>;
    /** Is element currently being on canvas. */
    isMounted: boolean;
}
