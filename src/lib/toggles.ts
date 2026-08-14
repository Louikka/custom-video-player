/**
 * @returns boolean indicating if media now paused (`HTMLMediaElement.paused`).
 */
export async function togglePlayback(e: HTMLMediaElement): Promise<boolean>
{
    if (e.paused)
    {
        try
        {
            await e.play();
        }
        catch (err)
        {
            console.error(err);
        }
    }
    else
    {
        e.pause();
    }

    return e.paused;
}

/**
 * @param e target element to put in fullscreen.
 * @returns boolean indicating if there is any element that currently in fullscreen mode.
 */
export async function toggleFullscreen(e: HTMLElement): Promise<boolean>
{
    if (document.fullscreenElement === null)
    {
        try
        {
            await e.requestFullscreen();
        }
        catch (err)
        {
            console.error(err);
        }
    }
    else
    {
        try
        {
            await document.exitFullscreen();
        }
        catch (err)
        {
            console.error(err);
        }
    }

    return document.fullscreenElement !== null;
}


