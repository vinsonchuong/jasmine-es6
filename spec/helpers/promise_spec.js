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

describe('Promise', function() {
  it('works', async function() {
    const promise = new TestPromise();
    spyOn(implementation, 'fetch').and.returnValue(promise);
    implementation.doStuff();
    expect(implementation.showSpinner).toBe(true);
    await promise.resolve();
    expect(implementation.showSpinner).toBe(false);
  });
});
