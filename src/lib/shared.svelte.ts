export const canvasElementIDClassTemplate = '__VideoPlayer_canvas_element_';

export interface CanvasElement {
    /** Element that should be displayed on canvas. */
    e: HTMLElement;
    id: string;
    /** Timestamp (in seconds) when element should be shown. */
    showAt: number;
    /** Timestamp (in seconds) past which element should be hidden. */
    hideAt: number;
    /** Is element currently being on canvas. */
    isMounted: boolean;
}

export const canvasElements = $state<CanvasElement[]>([]);

/**
 * @param e element that should be displayed on canvas.
 * @param showAt timestamp (in seconds) when element should be shown.
 * @param hideAt timestamp (in seconds) past which element should be hidden.
 * @param id optional ID for element (required to be able to delete element from canvas).
 */
export function addElementToCanvas(e: HTMLElement, showAt: number, hideAt: number, id: string = crypto.randomUUID())
{
    e.classList.add(canvasElementIDClassTemplate + id);

    canvasElements.push({
        e,
        id,
        showAt,
        hideAt,
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
