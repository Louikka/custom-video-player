import { expect, test } from 'vitest';
import { isNil, isTimeInTimeframe } from './lib';


test.for([
    { input: undefined, expected: true },
    { input: null, expected: true },
    { input: 0, expected: false },
    { input: 'abc', expected: false },
    { input: '', expected: false },
    { input: {}, expected: false },
    { input: NaN, expected: false },
])(`isNil($input) => $expected`, ({ input, expected }) =>
{
    expect(isNil(input)).toBe(expected);
});


test.for([
    { arg1: 5, arg2: { start: 0, end: 10 }, expected: true },
    { arg1: 0, arg2: { start: 0, end: 10 }, expected: true },
    { arg1: 10, arg2: { start: 0, end: 10 }, expected: false },
    { arg1: 11, arg2: { start: 0, end: 10 }, expected: false },
    { arg1: 123, arg2: { start: 10 }, expected: true },
    { arg1: 123, arg2: { end: 124 }, expected: true },
    { arg1: 1, arg2: { start: 2 }, expected: false },
    { arg1: 69, arg2: { end: 67 }, expected: false },
    { arg1: 1234567890, arg2: {}, expected: true },
])(`isTimeInTimeframe($arg1, $arg2) => $expected`, ({ arg1, arg2, expected }) =>
{
    expect(isTimeInTimeframe(arg1, arg2)).toBe(expected);
});
