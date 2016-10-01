import installAsync from 'jasmine-es6/overrides/async';

export default function install(env = global) {
  installAsync(env);
}

export {default as catchError} from 'jasmine-es6/helpers/catch_error';
