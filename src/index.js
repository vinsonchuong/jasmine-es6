import installAsync from './overrides/async';

export default function install(env = global) {
  installAsync(env);
}

export {default as catchError} from './helpers/catch_error';
export {default as Promise} from './helpers/promise';
