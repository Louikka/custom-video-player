import type { Script } from '../widgets';


class VMError extends Error
{
    constructor(message?: string)
    {
        super(message);
        this.name = this.constructor.name;
    }
}


export type VariableValueNumber = number;
export type VariableValueNil = 'NIL';

export interface VMVariable {
    name: string;
    value: VariableValueNumber | VariableValueNil;
}


export class VM
{
    constructor(script: Script)
    {
        const varsDeclarations = script.declarations?.filter(decl => decl.type === 'DECL_VARIABLE');
        if (varsDeclarations !== undefined)
        {
            // initiate variables
            for (const decl of varsDeclarations)
            {
                if (this.vars.find(o => o.name === decl.name) !== undefined)
                {
                    throw new VMError(`An error occured while initiating VM: Variable "${decl.name}" already declared.`);
                }

                this.vars.push({
                    name: decl.name,
                    value: 'NIL',
                });
            }
        }
    }


    private readonly vars: VMVariable[] = [];
}
