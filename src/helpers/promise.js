import {Promise as ES6Promise} from 'es6-promise';
import Privates from 'jasmine-es6/lib/privates';

const privates = new Privates();

export default class extends ES6Promise {
  constructor() {
    let resolve, reject, finish;
    super((...args) => [resolve, reject] = args);
    const finished = new Promise((...args) => [finish] = args);
    privates.set(this, {resolve, reject, finish, finished, count: 0});
  }

  resolve() {
    const {resolve: res, finished} = privates.get(this);
    res();
    return finished;
  }

  acquire() {
    const {count} = privates.get(this);
    privates.assign(this, {count: count + 1});
  }

  release() {
    const {count, finish} = privates.get(this);
    privates.assign(this, {count: count - 1});
    if (count - 1 === 0) {
      finish();
    }
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
