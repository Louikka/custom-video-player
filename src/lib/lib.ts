export type Nil = null | undefined;

/** Checks if value is `null` or `undefined`. */
export function isNil(v: unknown): v is Nil
{
    if (v === undefined || v === null) return true;
    return false;
}

export function clamp(val: number, min: number, max: number): number
{
    return Math.min(Math.max(val, min), max);
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

/**
 * Formats duration as `hh:mm:ss`.
 *
 * @param t duration in seconds.
 */
export function toHHMMSSDuration(t: number): string
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

export function calculateDefaultValue(min: number, max: number): number
{
    return (max < min) ? min : min + (max - min) / 2;
}
