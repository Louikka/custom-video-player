import { isTimeInTimeframe } from './lib';
import { canvasElementIDClassTemplate } from '../shared.svelte';
import type { CanvasElement } from '../types/global';


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

export function manageCanvasElementsOnTimeupdate(video: HTMLVideoElement, canvas: HTMLElement, canvasElements: CanvasElement[])
{
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
