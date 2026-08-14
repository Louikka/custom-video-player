// export interface VideoPlayerOptions {
//     /** Timeout (in ms) for hiding controls when not hovering or moving mouse. */
//     controlsTimeout: number;
//     /** Time (in ms) in which cursor should be hidden due to inactivity. */
//     cursorInactivityTimeout: number;

//     /** In seconds. */
//     playbackJumpValue: number;
// }

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
