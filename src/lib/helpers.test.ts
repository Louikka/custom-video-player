import { expect, test } from 'vitest';
import { getMediaTimeRatio } from './helpers';


test.for([
    { curr: 0, dur: 0, expected: 0 },
    { curr: 10, dur: 40, expected: 0.25 },
    { curr: 1, dur: 60, expected: 1/60 },
    { curr: 123, dur: 456, expected: 123/456 },
    { curr: -1, dur: 10, expected: 0 },
    { curr: 1, dur: -1, expected: 0 },
    { curr: 1, dur: Infinity, expected: 0 },
    { curr: 1, dur: NaN, expected: 0 },
    { curr: Infinity, dur: 1, expected: 0 },
    { curr: NaN, dur: 1, expected: 0 },
])(`getMediaTimeRatio($curr, $dur) => $expected`, ({ curr, dur, expected }) =>
{
    expect(getMediaTimeRatio(curr, dur)).toBeCloseTo(expected);
});
