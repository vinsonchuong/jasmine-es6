import TestPromise from '../../src/helpers/promise';
import install from '../../src/overrides/async';
install();

const implementation = {
  fetch(url) { return new Promise((resolve, reject) => null) },
  async doStuff() {
    this.showSpinner = true;
    await this.fetch('https://google.com');
    this.showSpinner = false;
  }
}

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
