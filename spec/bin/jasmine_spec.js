import path from 'path';
import {exec} from 'child-process-promise';

async function cli(fixture, env = null) {
  try {
    const child = await exec(
      path.resolve('src/bin/jasmine.js'),
      {
        cwd: path.resolve(`fixtures/${fixture}`),
        env: Object.assign({}, process.env, env)
      }
    );
    return child.stdout;
  } catch (e) {
    return e.stdout;
  }
}

describe('jasmine-es6', function() {
  it('uses spec/support/jasmine.json if it exists', async function() {
    expect(await cli('with_jasmine_json'))
      .toContain('1 spec, 0 failures');
  });

  it('uses the default jasmine.json if spec/support/jasmine.json does not exist', async function() {
    expect(await cli('without_jasmine_json'))
      .toContain('1 spec, 0 failures');
  });

  it('allows configuring the jasmine.json path via environment variable', async function() {
    expect(await cli(
      'with_jasmine_json',
      {
        JASMINE_CONFIG_PATH: 'spec/support/jasmine2.json'
      }
    )).toContain('No specs found');
  });
});
