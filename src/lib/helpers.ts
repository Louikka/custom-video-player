import { isTimeInTimeframe } from './lib';
import { canvasElementIDClassTemplate, type CanvasElement } from './shared.svelte';


/** Returns number in range 0 to 1, which indicates current progress. */
export function getMediaTimeRatio(currentTime: number, duration: number): number
{
    if (Number.isFinite(currentTime) && Number.isFinite(duration)
        && currentTime >= 0 && duration > 0)
    {
        return currentTime / duration;
    }

    return 0;
}

export function manageCanvasElementsOnTimeupdate(ev: Event, canvas: HTMLElement, canvasElements: CanvasElement[])
{
    const video = ev.currentTarget as HTMLVideoElement;
    if (!(video instanceof HTMLVideoElement))
    {
        throw new TypeError(`Cannot manage canvas elements on timeupdate event: event handler are not attached to HTMLVideoElement.`);
    }

    for (const ce of canvasElements)
    {
        let shouldShow = false;

        if (Array.isArray(ce.dt))
        {
            shouldShow = ce.dt.some(v => isTimeInTimeframe(video.currentTime, { start: v.showAt, end: v.hideAt }));
        }
        else
        {
            shouldShow = isTimeInTimeframe(video.currentTime, { start: ce.dt.showAt, end: ce.dt.hideAt });
        }

        if (!ce.isMounted && shouldShow)
        {
            canvas.append(ce.e);
            ce.isMounted = true;
        }
        else if (ce.isMounted && !shouldShow)
        {
            canvas.querySelector(`.${canvasElementIDClassTemplate}${ce.id}`)?.remove();
            ce.isMounted = false;
        }
    }
}
