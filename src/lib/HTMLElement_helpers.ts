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
