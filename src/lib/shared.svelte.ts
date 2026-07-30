export const canvasElementIDClassTemplate = '__VideoPlayer_canvas_element_';


export interface CanvasElement {
    /** Element that should be displayed on canvas. */
    e: HTMLElement;
    id: string;
    /** Display timing. */
    dt: DisplayTiming | Array<DisplayTiming>;
    /** Is element currently being on canvas. */
    isMounted: boolean;
}

export const canvasElements = $state<CanvasElement[]>([]);


export interface DisplayTiming {
    /** Timestamp (in seconds) when element should be shown. */
    showAt: number;
    /** Timestamp (in seconds) past which element should be hidden. */
    hideAt: number;
}

/**
 * @param e element that should be displayed on canvas.
 * @param dt timings to display element.
 * @param id optional ID for element (required to be able to delete element from canvas).
 */
export function addElementToCanvas(e: HTMLElement, dt: DisplayTiming | DisplayTiming[], id: string = crypto.randomUUID())
{
    e.classList.add(canvasElementIDClassTemplate + id);

    canvasElements.push({
        e,
        id,
        dt,
        isMounted: false,
    });
}

export function removeElementFromCanvas(id: string)
{
    const i = canvasElements.findIndex(e => e.id === id);
    if (i > -1)
    {
        canvasElements.splice(i, 1);
    }
    else
    {
        console.warn(`Cannot find element with id "${id}" on canvas.`);
    }
}

export function clearCanvas()
{
    canvasElements.length = 0;
}
