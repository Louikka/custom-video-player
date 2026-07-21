// #region Helper types

/** Media timestamp expressed in seconds. */
export type Timestamp = number;

/**
 * Simple expression : `"1 + 2"`.
 *
 * Expression with a variable : `"$variable_name * 3"`.
 */
export type Expression = string;

export interface DisplayTiming {
    show: Timestamp;
    hide: Timestamp;
}

// Number from 0 to 1.
export interface Position {
    x: number;
    y: number;
}



export type Action = ActionJump | ActionAssignVariable;

export interface ActionJump {
    type: 'ACT_JUMP';
    to: Timestamp;
}

export interface ActionAssignVariable {
    type: 'ACT_VARIABLE_ASSIGNMENT';
    variable_name: string;
    expression: Expression;
}

// #endregion



// #region Widget templates

export interface WidgetTemplate {
    position: Position;
    display: DisplayTiming | Array<DisplayTiming>;

    /** Any valid CSS styles. */
    style?: string;
    use_style_decl?: Array<StyleDeclaration['name']>;
}

// #endregion





// #region Main

export interface Script {
    version?: number | string;
    declarations?: Array<Declaration>;
    widgets?: Array<Widget>;
}



export type Declaration = VariableDeclaration | StyleDeclaration | LabelDeclaration;

export interface VariableDeclaration {
    type: 'DECL_VARIABLE';
    name: string;
    /** Expression which value used as initial. If omitted, variable's value defaults to `null`. */
    initial_value?: Expression;
}

export interface StyleDeclaration {
    type: 'DECL_STYLE';
    name: string;
    /** Any valid CSS styles. */
    style: string;
}

export interface LabelDeclaration {
    type: 'DECL_LABEL';
    name: string;
    timestamp: Timestamp;
}



export type Widget = WidgetText | WidgetButton;

export interface WidgetText extends WidgetTemplate {
    type: 'WIDG_TEXT';
    name?: string;
    text?: string;
}

export interface WidgetButton extends WidgetTemplate {
    type: 'WIDG_BUTTON';
    name?: string;
    text?: string;
    onclick?: Array<Action>;
}

// #endregion
