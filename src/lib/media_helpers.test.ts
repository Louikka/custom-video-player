import { expect, test } from 'vitest';
import { formatMediaDuration, getMediaTimeRatio } from './media_helpers';


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
])(`formatMediaDuration($input) => $expected`, ({ input, expected }) =>
{
    expect(formatMediaDuration(input as number)).toBe(expected);
});


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
