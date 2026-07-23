export type Nil = null | undefined;

/** Checks if value is `null` or `undefined`. */
export function isNil(v: unknown): v is Nil
{
    if (v === undefined || v === null) return true;
    return false;
}


/**
 * Formats duration as `hh:mm:ss`.
 * @param t duration in seconds.
 */
export function formatVideoDuration(t: number): string
{
    if (!Number.isFinite(t) || t < 0)
    {
        return '';
    }

    t = Math.trunc(t);

    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t % 3600) / 60);
    const seconds = t % 60;

    let s = String(seconds).padStart(2, '0');

    if (hours <= 0)
    {
        s = `${String(minutes)}:${s}`;
    }
    else
    {
        s = `${String(hours)}:${String(minutes).padStart(2, '0')}:${s}`;
    }

    return s;
}


export function isTimeInTimeframe(t: number, frame: { start?: number, end?: number }): boolean
{
    frame.start ??= 0;
    frame.end ??= Infinity;

    if (!Number.isFinite(frame.start) || frame.start < 0) frame.start = 0;
    if (Number.isNaN(frame.end) || frame.end < frame.start) frame.end = frame.start;

    return t >= frame.start && t < frame.end;
}


export type MediaPreloadValue = '' | 'none' | 'metadata' | 'auto';

/**
 * Formats Media `preload` attribute value to match one of the permitted `""`,
 * `"none"`, `"metadata"` or `"auto"`. If `val` not matches, returns default
 * `"metadata"`.
 */
export function formatMediaPreload(val?: string): MediaPreloadValue
{
    if (val === '' || val === 'none' || val === 'metadata' || val === 'auto')
    {
        return val;
    }

    return 'metadata';
}


export function togglePlayback(e: HTMLMediaElement)
{
    if (e.paused)
    {
        e.play();
    }
    else
    {
        e.pause();
    }
}

export async function toggleFullscreen(e: HTMLElement): Promise<boolean>
{
    if (document.fullscreenElement === null)
    {
        try
        {
            await e.requestFullscreen();
            return true;
        }
        catch (err)
        {
            console.error(err);
            return false;
        }
    }
    else
    {
        // also async and can reject, but its fine?
        // (possible) todo: handle error
        await document.exitFullscreen();
        return false;
    }
}


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
