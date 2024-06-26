import {
  formatPrometheusDuration,
  parsePrometheusDuration,
} from '@openshift-console/plugin-shared/src/datetime/prometheus';
import { getDuration, isValid } from '../../../public/components/utils/datetime';

describe('isValid', () => {
  it('rejects non-dates', () => {
    expect(isValid('hello' as any)).toEqual(false);
  });

  it('accepts 0 epoch date', () => {
    expect(isValid(new Date(0))).toEqual(true);
  });

  it('accepts now', () => {
    expect(isValid(new Date())).toEqual(true);
  });
});

// Converts time durations to milliseconds
const ms = (s = 0, m = 0, h = 0, d = 0, w = 0) =>
  ((((w * 7 + d) * 24 + h) * 60 + m) * 60 + s) * 1000;

describe('getDuration', () => {
  it('returns correct durations', () => {
    expect(getDuration(ms(1))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
    expect(getDuration(ms(2, 1))).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 2 });
    expect(getDuration(ms(3, 2, 1))).toEqual({ days: 0, hours: 1, minutes: 2, seconds: 3 });
    expect(getDuration(ms(4, 3, 2, 1))).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });
  it('handles invalid values', () => {
    [null, undefined, 0, -1, -9999].forEach((v) =>
      expect(getDuration(v)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 }),
    );
  });
});

describe('formatPrometheusDuration', () => {
  it('formats durations correctly', () => {
    expect(formatPrometheusDuration(ms(1))).toEqual('1s');
    expect(formatPrometheusDuration(ms(2, 1))).toEqual('1m 2s');
    expect(formatPrometheusDuration(ms(3, 2, 1))).toEqual('1h 2m 3s');
    expect(formatPrometheusDuration(ms(4, 3, 2, 1))).toEqual('1d 2h 3m 4s');
    expect(formatPrometheusDuration(ms(5, 4, 3, 2, 1))).toEqual('1w 2d 3h 4m 5s');
  });

  it('handles invalid values', () => {
    [null, undefined, 0, -1, -9999].forEach((v) => expect(formatPrometheusDuration(v)).toEqual(''));
  });
});

describe('parsePrometheusDuration', () => {
  it('parses durations correctly', () => {
    expect(parsePrometheusDuration('1s')).toEqual(ms(1));
    expect(parsePrometheusDuration('100s')).toEqual(ms(100));
    expect(parsePrometheusDuration('1m')).toEqual(ms(0, 1));
    expect(parsePrometheusDuration('90m')).toEqual(ms(0, 90));
    expect(parsePrometheusDuration('1h')).toEqual(ms(0, 0, 1));
    expect(parsePrometheusDuration('2h 0m 0s')).toEqual(ms(0, 0, 2));
    expect(parsePrometheusDuration('13h 10m 23s')).toEqual(ms(23, 10, 13));
    expect(parsePrometheusDuration('25h 61m 61s')).toEqual(ms(61, 61, 25));
    expect(parsePrometheusDuration('123h')).toEqual(ms(0, 0, 123));
    expect(parsePrometheusDuration('1d')).toEqual(ms(0, 0, 0, 1));
    expect(parsePrometheusDuration('2d 6h')).toEqual(ms(0, 0, 6, 2));
    expect(parsePrometheusDuration('8d 12h')).toEqual(ms(0, 0, 12, 8));
    expect(parsePrometheusDuration('10d 12h 30m 1s')).toEqual(ms(1, 30, 12, 10));
    expect(parsePrometheusDuration('1w')).toEqual(ms(0, 0, 0, 0, 1));
    expect(parsePrometheusDuration('5w 10d 12h 30m 1s')).toEqual(ms(1, 30, 12, 10, 5));
    expect(parsePrometheusDuration('999w 999h 999s')).toEqual(ms(999, 0, 999, 0, 999));
  });

  it('handles 0 values', () => {
    expect(parsePrometheusDuration('0s')).toEqual(0);
    expect(parsePrometheusDuration('0w 0d 0h 0m 0s')).toEqual(0);
    expect(parsePrometheusDuration('00h 000000m 0s')).toEqual(0);
  });

  it('handles invalid duration formats', () => {
    [
      '',
      null,
      undefined,
      '0',
      '12',
      'z',
      'h',
      'abc',
      '全角',
      '0.5h',
      '1hh',
      '1h1m',
      '1h h',
      '1h 0',
      '1h 0z',
      '-1h',
    ].forEach((v) => expect(parsePrometheusDuration(v)).toEqual(0));
  });

  it('mirrors formatPrometheusDuration()', () => {
    [
      '1s',
      '1m',
      '1h',
      '1m 40s',
      '13h 10m 23s',
      '2h 10s',
      '1d',
      '2d 6h',
      '1w',
      '5w 6d 12h 30m 1s',
      '999w',
      '',
    ].forEach((v) => expect(formatPrometheusDuration(parsePrometheusDuration(v))).toEqual(v));
  });
});
