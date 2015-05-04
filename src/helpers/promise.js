import {Promise as ES6Promise} from 'es6-promise';
import Privates from '../lib/privates';

const privates = new Privates();

export default class extends ES6Promise {
  constructor() {
    let resolve, reject, finish;
    super((...args) => [resolve, reject] = args);
    let finished = new Promise(resolve => finish = resolve);
    privates.set(this, {resolve, reject, finish, finished, count: 0});
  }

  resolve() {
    let {resolve, finished} = privates.get(this);
    resolve();
    return finished;
  }

  acquire() {
    let {count} = privates.get(this);
    count++;
    privates.assign(this, {count});
  }

  release() {
    let {count, finish} = privates.get(this);
    count--;
    privates.assign(this, {count})
    if (count === 0) finish();
  }

  then(onFulfilled, onRejected) {
    this.acquire();
    return super.then(
      result => {
        onFulfilled(result);
        this.release();
      },
      onRejected
    );
  }
}
