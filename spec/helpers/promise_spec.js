import {catchError} from 'jasmine-es6';
import TestPromise from 'jasmine-es6/helpers/promise';

const implementation = {
  fetch() {
    return new Promise(() => null);
  },
  async doStuff() {
    this.showSpinner = true;
    await this.fetch('https://google.com');
    this.showSpinner = false;
  }
};

describe('Promise', () => {
  it('resolves after all of its listeners are called', async () => {
    const promise = new TestPromise();
    spyOn(implementation, 'fetch').and.returnValue(promise);
    implementation.doStuff();
    expect(implementation.showSpinner).toBe(true);
    await promise.resolve();
    expect(implementation.showSpinner).toBe(false);
  });

  xit('fails if any of its listeners raises an exception', async () => {
    const promise = new TestPromise();
    spyOn(implementation, 'fetch').and.returnValue(promise);
    implementation.doStuff().then(() => {
      throw new Error('error message');
    });
    expect(await catchError(promise.resolve())).toBe('error message');
  });
});
