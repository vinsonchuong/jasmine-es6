const fnNames = [
  'beforeAll', 'afterAll',
  'beforeEach', 'afterEach',
  'it', 'fit'
];

function wrap(jasmineFn) {
  return function(...args) {
    let callback = args[args.length - 1];
    if (callback.toString().includes('regeneratorRuntime.async')) {
      const oldCallback = callback;
      callback = async function(done) {
        try {
          await oldCallback.call(this);
          done();
        } catch(e) {
          done.fail(e);
        }
      };
    }
    return jasmineFn(...args.slice(0, -1), callback);
  };
}

let installed = false;
export default function install(env = global) {
  if (installed) {
    return;
  }
  installed = true;
  for (const fnName of fnNames) {
    env[fnName] = wrap(env[fnName]);
  }
}
