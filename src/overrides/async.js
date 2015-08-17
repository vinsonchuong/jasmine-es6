import parseArgs from 'jasmine-es6/lib/parse-args';

const fnNames = [
  'beforeAll', 'afterAll',
  'beforeEach', 'afterEach',
  'it', 'fit'
];

function wrap(jasmineFn) {
  return function wrapped(...args) {
    const {title, callback, timeout} = parseArgs(
      args,
      {title: String, callback: Function, timeout: Number},
      ['title', 'callback'],
      ['title', 'callback', 'timeout'],
      ['callback'],
      ['callback', 'timeout']
    );

    let newCallback = callback;

    if (callback.toString().includes('regeneratorRuntime.async')) {
      newCallback = async function wrappedCallback(done) {
        try {
          /* eslint-disable */
          await Reflect.apply(callback, this);
          /* eslint-enable */
          done();
        } catch(error) {
          done.fail(error);
        }
      };
    }

    return jasmineFn(...[title, newCallback, timeout].filter(Boolean));
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
