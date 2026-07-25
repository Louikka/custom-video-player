import type {
    Operator,
    Punctuation,
    Token,
    TokenKeyword,
    TokenNumber,
    TokenOperator,
    TokenPunctuation,
    TokenVariable
} from './tokens';
import { isTokenOperator, TokenType } from './tokens';


class ScannerError extends Error
{
    constructor(message?: string)
    {
        super(message);
        this.name = this.constructor.name;
    }
}


function isDigit(char: string): boolean
{
    return /\d/.test(char);
}

function isVarStart(char: string): boolean
{
    return char === '$';
}

function isLetter(char: string): boolean
{
    return /[a-zA-Z]/.test(char);
}

function isWhitespace(char: string): boolean
{
    return ' \t\r'.includes(char);
}

function isPunctuation(s: string): s is Punctuation
{
    return [ '(', ')' ].includes(s);
}

function isOperator(s: string): s is Operator
{
    return [ '+', '-', '*', '/' ].includes(s);
}


type PredicateFn = (char: string, before: string, after: string, readString: string) => boolean;

export class Scanner
{
    constructor(s: string)
    {
        this.s = s.trim().replace(/[\r\n]+/gm, ' ').toUpperCase();
    }


    private readonly s: string;
    private pos = 0;

    /** If the extression can be evaluated without context (doesn't have variables). */
    public isPure = true;


    private peek(step = 0): string
    {
        return this.s.charAt(this.pos + step);
    }

    private next(): string
    {
        this.pos++;
        return this.peek();
    }

    private isEOF(): boolean
    {
        return this.peek() === '';
    }


    private readwhile(predicate: PredicateFn): string
    {
        let s = '';

        while (!this.isEOF() && predicate(this.peek(), this.peek(-1), this.peek(1), s))
        {
            s += this.peek();
            this.next();
        }

        return s;
    }


    private readNumber(): TokenNumber
    {
        let isFloat = false;
        let isScientific = false;

        const nString = this.readwhile((char, before, after, s) =>
        {
            if (char === '.')
            {
                if (isFloat) return false;

                isFloat = true;
                return true;
            }

            if (char === 'E' && (after === '-' || isDigit(after)))
            {
                if (isScientific) return false;

                isScientific = true;
                return true;
            }

            if (char === '-' && isScientific && before === 'E')
            {
                return true;
            }

            return isDigit(char);
        });

        const n = Number(nString);
        if (!Number.isFinite(n))
        {
            throw new ScannerError(`Cannot parse "${nString}" as a number.`);
        }

        return {
            type: TokenType.NUMBER,
            value: n,
        };
    }

    private readVariable(): TokenVariable
    {
        let isVar = false;

        const v = this.readwhile((char, prev, next) =>
        {
            if (char === '$')
            {
                if (isDigit(next))
                {
                    throw new ScannerError(`Variables cannot start with a number.`);
                }

                if (isVar)
                {
                    throw new ScannerError(`Symbol "$" are not allowed as name of variable.`);
                }

                isVar = true;
                return true;
            }

            if (isVar && (isLetter(char) || isDigit(char))) return true;

            return false;
        });

        return {
            type: TokenType.VARIABLE,
            value: v,
        };
    }

    private readKeyword(): TokenKeyword
    {
        const kw = this.readwhile(isLetter);

        return {
            type: TokenType.KEYWORD,
            value: kw,
        };
    }

    private readPunctuation(): TokenPunctuation
    {
        const punc = this.peek();

        this.next();

        switch (punc)
        {
            case '(':
            {
                return {
                    type: TokenType.LEFT_PAREN,
                };
            }
            case ')':
            {
                return {
                    type: TokenType.RIGHT_PAREN,
                };
            }

            default:
            {
                throw new ScannerError(`Undefined punctuation "${punc}".`);
            }
        }
    }

    private readOperator(): TokenOperator
    {
        const oper = this.peek();

        this.next();

        switch (oper)
        {
            case '+':
            {
                return {
                    type: TokenType.OPER_ADD,
                };
            }
            case '-':
            {
                return {
                    type: TokenType.OPER_SUB,
                };
            }
            case '*':
            {
                return {
                    type: TokenType.OPER_MUL,
                };
            }
            case '/':
            {
                return {
                    type: TokenType.OPER_DIV,
                };
            }

            default:
            {
                throw new ScannerError(`Undefined operator "${oper}".`);
            }
        }
    }


    private readNextToken(): Token
    {
        // skip all whitespaces
        this.readwhile((char) => isWhitespace(char));

        if (this.isEOF())
        {
            return {
                type: TokenType.EOF,
            };
        }

        const char = this.peek();

        if (isDigit(char))
        {
            return this.readNumber();
        }

        if (isVarStart(char))
        {
            this.isPure = false;
            return this.readVariable();
        }

        if (isLetter(char))
        {
            return this.readKeyword();
        }

        if (isPunctuation(char))
        {
            return this.readPunctuation();
        }

        if (isOperator(char))
        {
            return this.readOperator();
        }

        throw new ScannerError(`Undefined character "${char}".`);
    }


    public scan(): Array<Token>
    {
        const tl = [];

        for (;;)
        {
            const token = this.readNextToken();
            if (token.type === TokenType.EOF) break;
            tl.push(token);
        }

        // reset class
        this.pos = 0;

        return tl;
    }
}



export function parseExpression(expr: string)
{
    const scanner = new Scanner(expr);
    const tl = scanner.scan();
    // TODO: implement this
}
