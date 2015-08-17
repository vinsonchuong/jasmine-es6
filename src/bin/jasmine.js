import fs from 'fs';

require('babel/register')({stage: 0});

fs.exists('spec/support/jasmine.json', configExists => {
  if (!configExists) {
    process.env.JASMINE_CONFIG_PATH =
      process.env.JASMINE_CONFIG_PATH ||
      require.resolve('jasmine-es6/config/jasmine.json');
  }

  require('jasmine/bin/jasmine');
});
