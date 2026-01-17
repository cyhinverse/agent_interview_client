import { cn, getErrorMessage } from '@/lib/utils';

describe('cn (class name utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should merge Tailwind classes correctly', () => {
    // tailwind-merge should dedupe conflicting classes
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });
});

describe('getErrorMessage', () => {
  it('should return message from error.data.message', () => {
    const error = {
      data: {
        message: 'Custom error message',
      },
    };
    expect(getErrorMessage(error)).toBe('Custom error message');
  });

  it('should return default message when error.data.message is not available', () => {
    const error = { data: {} };
    expect(getErrorMessage(error, 'Default error')).toBe('Default error');
  });

  it('should return default message when error is null', () => {
    expect(getErrorMessage(null, 'Default error')).toBe('Default error');
  });

  it('should return default message when error is undefined', () => {
    expect(getErrorMessage(undefined, 'Default error')).toBe('Default error');
  });

  it('should return default message when error is a string', () => {
    expect(getErrorMessage('string error', 'Default error')).toBe(
      'Default error'
    );
  });

  it('should return default message when error.data is not an object', () => {
    const error = { data: 'string data' };
    expect(getErrorMessage(error, 'Default error')).toBe('Default error');
  });

  it('should use "An unexpected error occurred" as default message', () => {
    expect(getErrorMessage({})).toBe('An unexpected error occurred');
  });

  it('should handle error.data.message being non-string', () => {
    const error = { data: { message: 123 } };
    expect(getErrorMessage(error, 'Default error')).toBe('Default error');
  });
});
