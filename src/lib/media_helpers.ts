/**
 * Formats duration as `hh:mm:ss`.
 * @param t duration in seconds.
 */
export function formatMediaDuration(t: number): string
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
