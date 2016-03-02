import * as path from 'path';
import glob from 'glob';
import {promisify} from 'node-promise-es6';

export async function specFiles() {
  return await promisify(glob)(path.resolve('spec', '**/*_spec.js'));
}
