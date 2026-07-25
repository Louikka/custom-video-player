import { expect, test } from 'vitest';
import { Scanner } from './parser';
import { TokenType } from './tokens';


test.for([
    {
        input: '(+ 1 2)',
        expected: [
            {
                type: TokenType.LEFT_PAREN,
            },
            {
                type: TokenType.OPER_ADD,
            },
            {
                type: TokenType.NUMBER,
                value: 1,
            },
            {
                type: TokenType.NUMBER,
                value: 2,
            },
            {
                type: TokenType.RIGHT_PAREN,
            },
        ],
    },
    {
        input: '1 2.3 4e5 6E-7 $ $var FUNC() + - * /',
        expected: [
            {
                type: TokenType.NUMBER,
                value: 1,
            },
            {
                type: TokenType.NUMBER,
                value: 2.3,
            },
            {
                type: TokenType.NUMBER,
                value: 400000,
            },
            {
                type: TokenType.NUMBER,
                value: 0.0000006,
            },
            {
                type: TokenType.VARIABLE,
                value: '$',
            },
            {
                type: TokenType.VARIABLE,
                value: '$VAR',
            },
            {
                type: TokenType.KEYWORD,
                value: 'FUNC',
            },
            {
                type: TokenType.LEFT_PAREN,
            },
            {
                type: TokenType.RIGHT_PAREN,
            },
            {
                type: TokenType.OPER_ADD,
            },
            {
                type: TokenType.OPER_SUB,
            },
            {
                type: TokenType.OPER_MUL,
            },
            {
                type: TokenType.OPER_DIV,
            },
        ],
    },
])(`$input => $expected`, ({ input, expected }) =>
{
    const scanner = new Scanner(input);
    expect(scanner.scan()).toEqual(expected);
});
