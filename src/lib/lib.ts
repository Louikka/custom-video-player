export type Nil = null | undefined;

/** Checks if value is `null` or `undefined`. */
export function isNil(v: unknown): v is Nil
{
    if (v === undefined || v === null) return true;
    return false;
}

export function formatVideoDuration(t: number): string
{
    if (!isNumber(t) || t < 0)
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
