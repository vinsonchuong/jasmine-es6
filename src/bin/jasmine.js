import * as runEs from 'dist-es6/lib/run';
import {run} from 'esnext-async';
import {configPath} from 'jasmine-es6/lib/reflect';

run(async () => {
  process.env.JASMINE_CONFIG_PATH =
    process.env.JASMINE_CONFIG_PATH ||
    await configPath();
  runEs.module(require.resolve('jasmine/bin/jasmine'));
});
