import { expect, test } from 'vitest';
import { formatVideoDuration, isNil, isTimeInTimeframe } from './lib';


test.for([
    { input: undefined, expected: true },
    { input: null, expected: true },
    { input: 0, expected: false },
    { input: 'abc', expected: false },
    { input: {}, expected: false },
    { input: NaN, expected: false },
])(`isNil($input) => $expected`, ({ input, expected }) =>
{
    expect(isNil(input)).toBe(expected);
});


test.for([
    { input: 0, expected: '0:00' },
    { input: 1, expected: '0:01' },
    { input: 12, expected: '0:12' },
    { input: 60, expected: '1:00' },
    { input: 125, expected: '2:05' },
    { input: 4953, expected: '1:22:33' },
    { input: 4168, expected: '1:09:28' },
    { input: 59648, expected: '16:34:08' },
    { input: 100000, expected: '27:46:40' },
    { input: 3.21, expected: '0:03' },
    { input: 9.999, expected: '0:09' },
    { input: '1', expected: '' },
    { input: NaN, expected: '' },
    { input: -1, expected: '' },
    { input: Infinity, expected: '' },
])(`formatVideoDuration($input) => $expected`, ({ input, expected }) =>
{
    // @ts-ignore
    expect(formatVideoDuration(input)).toBe(expected);
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
