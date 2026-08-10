import type { Component } from 'svelte';
import type { HTMLVideoAttributes } from 'svelte/elements';


export interface VideoPlayerOptions {
    /** Timeout (in ms) for hiding controls when not hovering or moving mouse. */
    controlsTimeout: number;
    /** Time (in ms) in which cursor should be hidden due to inactivity. */
    cursorInactivityTimeout: number;

    /** In seconds. */
    playbackJumpValue: number;
}


export interface VideoPlayerProperties {
    autoplay?: HTMLVideoAttributes['autoplay'];
    controls?: HTMLVideoAttributes['controls'];
    controlsList?: HTMLVideoAttributes['controlslist'] | 'noprogressbar';
    // crossOrigin?: HTMLVideoAttributes['crossorigin'];
    // disablePictureInPicture?: HTMLVideoAttributes['disablepictureinpicture'];
    // disableRemotePlayback?: HTMLVideoAttributes['disableremoteplayback'];
    // loading?: any;
    // loop?: HTMLVideoAttributes['loop'];
    // muted?: HTMLVideoAttributes['muted'];
    // poster?: HTMLVideoAttributes['poster'];
    // preload?: HTMLVideoAttributes['preload'];
    src?: HTMLVideoAttributes['src'];
}

export interface VideoPlayerMethods {
    /**
     * @param e element that should be displayed on canvas.
     * @param dt timings to display element.
     * @param id optional ID for element (required to be able to delete element from canvas).
     */
    addElementToCanvas(e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id?: string): void;

    removeElementFromCanvas(id: string): void;

    clearCanvas(): void;
}

export type VideoPlayerElement = HTMLElement & NonNullable<Component['element']> & VideoPlayerProperties & VideoPlayerMethods;


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
