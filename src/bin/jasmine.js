import fs from 'fs';
import run from 'dist-es6/lib/run';

fs.exists('spec/support/jasmine.json', (configExists) => {
  if (!configExists) {
    process.env.JASMINE_CONFIG_PATH =
      process.env.JASMINE_CONFIG_PATH ||
      require.resolve('jasmine-es6/config/jasmine.json');
  }
  run('jasmine/bin/jasmine');
});
