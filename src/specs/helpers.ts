import type { Declaration, LabelDeclaration, Script } from './widgets';


export function isStartLabel(o: Declaration): o is LabelDeclaration
{
    return o.type === 'DECL_LABEL' && o.name.toUpperCase() === 'START';
}


export function parseScript(s: string): Script
{
    let script = JSON.parse(s) as Script;
    return script;
}
