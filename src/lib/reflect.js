import * as path from 'path';
import * as fse from 'fs-extra-promise-es6';
import glob from 'glob';
import {promisify} from 'node-promise-es6';

export async function specFiles() {
  let jasmineJson;
  try {
    jasmineJson = await fse.readJson('spec/support/jasmine.json');
  } catch (error) {
    jasmineJson = await fse.readJson(
      require.resolve('jasmine-es6/config/jasmine.json'));
  }

  const files = [];
  for (const fileGlob of jasmineJson.spec_files) {
    const globResults = await promisify(glob)(
      path.resolve(jasmineJson.spec_dir, fileGlob));
    files.push(...globResults);
  }
  return files;
}
