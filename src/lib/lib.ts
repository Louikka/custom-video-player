export type Nil = null | undefined;

/** Checks if value is `null` or `undefined`. */
export function isNil(v: unknown): v is Nil
{
    if (v === undefined || v === null) return true;
    return false;
}

export function isTimeInTimeframe(t: number, frame: { start?: number, end?: number }): boolean
{
    frame.start ??= 0;
    frame.end ??= Infinity;

    if (!Number.isFinite(frame.start) || frame.start < 0) frame.start = 0;
    if (Number.isNaN(frame.end) || frame.end < frame.start) frame.end = frame.start;

    return t >= frame.start && t < frame.end;
}

/**
 * @param e target element to put in fullscreen.
 */
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

/**
 * Formats duration as ISO 8601 duration string.
 *
 * @param t duration in seconds.
 */
export function toISODuration(t: number): string
{
    if (!Number.isFinite(t) || t < 0)
    {
        return '';
    }

    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;

    let duration = 'PT';

    if (h > 0) duration += `${h}H`;
    if (m > 0) duration += `${m}M`;
    if (s > 0 || duration === 'PT') duration += `${s}S`;

    return duration;
}
