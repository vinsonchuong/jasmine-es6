#!/usr/bin/env node
var fs = require('fs');

require('babel/register');

fs.exists('spec/support/jasmine.json', function(configExists) {
  if (!configExists) {
    process.env.JASMINE_CONFIG_PATH =
      process.env.JASMINE_CONFIG_PATH ||
      require.resolve('jasmine/lib/examples/jasmine.json');
  }
  require('jasmine/bin/jasmine');
});
