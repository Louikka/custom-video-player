import { expect, test } from 'vitest';
import { shouldDisplayWidget } from './helpers';


test.for([
    { arg1: 1, arg2: { show: 0, hide: 5 }, expected: true },
    { arg1: 0, arg2: { show: 0, hide: 5 }, expected: true },
    { arg1: 5, arg2: { show: 0, hide: 5 }, expected: false },
    { arg1: 10, arg2: [ { show: 0, hide: 5 }, { show: 8, hide: 12 } ], expected: true },
    { arg1: 9, arg2: [ { show: 0, hide: 5 }, { show: 10, hide: 15 } ], expected: false },
])(`isNil($arg1, $arg2) => $expected`, ({ arg1, arg2, expected }) =>
{
    expect(shouldDisplayWidget(arg1, arg2)).toBe(expected);
});
