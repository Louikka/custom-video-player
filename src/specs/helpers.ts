import { isTimeInTimeframe } from '../lib/lib';
import type { Declaration, LabelDeclaration, Script, WidgetTemplate } from './widgets';


export function isStartLabel(o: Declaration): o is LabelDeclaration
{
    return o.type === 'DECL_LABEL' && o.name.toUpperCase() === 'START';
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


export function parseScript(s: string): Script
{
    let script = JSON.parse(s) as Script;
    return script;
}
