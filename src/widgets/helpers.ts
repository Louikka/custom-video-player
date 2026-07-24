import { linear } from 'svelte/easing';
import { isTimeInTimeframe } from '../lib/lib';
import type { Declaration, EffectFadeTimingFunctions, LabelDeclaration, Script, WidgetTemplate } from './widgets';


export function parseScript(script: string | Script | undefined): Script | null
{
    let parsed = null;

    if (typeof script === 'string')
    {
        try
        {
            parsed = JSON.parse(script) as Script;
        }
        catch (err)
        {
            console.error(err);
        }
    }
    else if (typeof script === 'object' && script !== null)
    {
        parsed = script;
    }

    return parsed;
}

export function checkScript(script: Script)
{
    if (script.declarations !== undefined)
    {
        // ensure that all labels have unique names
        const names = new Set<LabelDeclaration['name']>();
        const labels = script.declarations.filter(o => o.type === 'DECL_LABEL');
        for (const o of labels)
        {
            if (names.has(o.name))
            {
                throw new Error(`Script has duplicated label declarations ("${o.name}").`);
            }

            names.add(o.name);
        }
    }
}


/**
 * @param t current time in seconds.
 * @param display `WidgetTemplate.display`.
 */
export function shouldDisplayWidget(t: number, display: WidgetTemplate['display']): boolean
{
    const displayTimings = [];

    if (Array.isArray(display))
    {
        displayTimings.push(...display);
    }
    else
    {
        displayTimings.push(display);
    }

    return displayTimings.some(dt => isTimeInTimeframe(t, { start: dt.show, end: dt.hide }))
}


export function isStartLabel(o: Declaration): o is LabelDeclaration
{
    return o.type === 'DECL_LABEL' && o.name.toUpperCase() === 'START';
}

export function getFadeTimingFunction(tf: EffectFadeTimingFunctions)
{
    switch (tf)
    {
        case 'linear':
        {
            return linear;
        }

        default:
        {
            throw new Error(`Unknown fade effect timing function "${tf}".`);
        }
    }
}
