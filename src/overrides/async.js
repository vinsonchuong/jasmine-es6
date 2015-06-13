import parseArgs from 'jasmine-es6/lib/parse-args';

const fnNames = [
  'beforeAll', 'afterAll',
  'beforeEach', 'afterEach',
  'it', 'fit'
];

function wrap(jasmineFn) {
  return function(...args) {
    let {title, callback, timeout} = parseArgs(
      args,
      {title: String, callback: Function, timeout: Number},
      ['title', 'callback'],
      ['title', 'callback', 'timeout'],
      ['callback'],
      ['callback', 'timeout']
    );

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

    return jasmineFn(...[title, callback, timeout].filter(Boolean));
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
