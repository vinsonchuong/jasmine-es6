import catchError from 'jasmine-es6/helpers/catch_error';

describe('catchError', function() {
  it('returns the error message for a failed async function', async function() {
    const errorMessage = 'This is the error message';
    const promise = Promise.reject(new Error(errorMessage));
    expect(await catchError(promise)).toBe(errorMessage);
  });

  it('can read the error message when a string is thrown', async function() {
    const errorMessage = 'This is the error message';
    const promise = Promise.reject(errorMessage);
    expect(await catchError(promise)).toBe(errorMessage);
  });

  it('returns undefined for a successful async function', async function() {
    const value = 42;
    const promise = Promise.resolve(value);
    expect(await catchError(promise)).toBeUndefined();
  });
});
