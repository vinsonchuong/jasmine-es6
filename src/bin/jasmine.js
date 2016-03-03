import run from 'dist-es6/lib/run';
import {configPath} from 'jasmine-es6/lib/reflect';

async function main() {
  process.env.JASMINE_CONFIG_PATH =
    process.env.JASMINE_CONFIG_PATH ||
    (await configPath());
  run(require.resolve('jasmine/bin/jasmine'));
}
main();
