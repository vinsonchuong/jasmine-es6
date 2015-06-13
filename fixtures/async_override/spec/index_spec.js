describe('dummy', function() {
  function promise(delay = 0) {
    return new Promise(resolve => setTimeout(() => resolve('done'), delay));
  }

  it('works with async', async function() {
    expect(await promise()).toBe('done');
  });

  it('allows increasing the timeout', async function() {
    expect(await promise(6000)).toBe('done');
  }, 10000);
});
