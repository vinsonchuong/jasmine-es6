import fs from 'fs';

require('babel-core/register')({
  presets: ['es2015', 'stage-0'],
  plugins: ['transform-runtime']
});

fs.exists('spec/support/jasmine.json', configExists => {
  if (!configExists) {
    process.env.JASMINE_CONFIG_PATH =
      process.env.JASMINE_CONFIG_PATH ||
      require.resolve('jasmine-es6/config/jasmine.json');
  }

  require('jasmine/bin/jasmine');
});
