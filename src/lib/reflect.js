import * as path from 'path';
import * as fse from 'fs-extra-promise-es6';
import glob from 'glob';
import {fs, promisify} from 'node-promise-es6';

const defaultConfigPath = require.resolve('jasmine-es6/config/jasmine.json');
const overrideConfigPath = path.resolve('spec/support/jasmine.json');

export async function configPath() {
  try {
    await fs.readFile(overrideConfigPath);
    return overrideConfigPath;
  } catch (error) {
    return defaultConfigPath;
  }
}

export async function config() {
  return await fse.readJson(await configPath());
}

export async function specFiles() {
  const jasmineJson = await config();
  const files = [];
  for (const fileGlob of jasmineJson.spec_files) {
    const globResults = await promisify(glob)(
      path.resolve(jasmineJson.spec_dir, fileGlob));
    files.push(...globResults);
  }
  return files;
}
