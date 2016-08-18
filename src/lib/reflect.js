import * as path from 'path';
import {fs} from 'node-promise-es6';

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
