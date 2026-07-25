export const TokenType = {
    // numbers
    NUMBER: 'Number',

    // variables
    VARIABLE: 'Variable',

    // keywords
    KEYWORD: 'Keyword',

    // punctuation
    LEFT_PAREN: 'LParen',
    RIGHT_PAREN: 'RParen',

    // operators
    OPER_ADD: 'OperAdd',
    OPER_SUB: 'OperSub',
    OPER_MUL: 'OperMul',
    OPER_DIV: 'OperDiv',

    // end of input
    EOF: 'EOF',
};


export type Punctuation = '(' | ')';
export type Operator = '+' | '-' | '*' | '/';


export type TokenNumber = {
    type: typeof TokenType.NUMBER;
    value: number;
};
export type TokenVariable = {
    type: typeof TokenType.VARIABLE;
    value: string;
};
export type TokenKeyword = {
    type: typeof TokenType.KEYWORD;
    value: string;
};
export type TokenPunctuation = {
    type:
        | typeof TokenType.LEFT_PAREN
        | typeof TokenType.RIGHT_PAREN
    ;
};
export type TokenOperator = {
    type:
        | typeof TokenType.OPER_ADD
        | typeof TokenType.OPER_SUB
        | typeof TokenType.OPER_MUL
        | typeof TokenType.OPER_DIV
    ;
};
export type TokenEOF = {
    type: typeof TokenType.EOF;
};

export type Token =
    | TokenNumber
    | TokenVariable
    | TokenKeyword
    | TokenPunctuation
    | TokenOperator
    | TokenEOF
;


export function isTokenPunctuation(token: Token): token is TokenPunctuation
{
    switch (token.type)
    {
        case TokenType.LEFT_PAREN:
        case TokenType.RIGHT_PAREN:
        {
            return true;
        }

        default:
        {
            return false;
        }
    }
}

export function isTokenOperator(token: Token): token is TokenOperator
{
    switch (token.type)
    {
        case TokenType.OPER_ADD:
        case TokenType.OPER_SUB:
        case TokenType.OPER_MUL:
        case TokenType.OPER_DIV:
        {
            return true;
        }

        default:
        {
            return false;
        }
    }
}
