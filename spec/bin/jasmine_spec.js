import path from 'path';
import {exec} from 'node-promise-es6/child-process';

async function cli(fixture, env = null) {
  const child = await exec(
    'jasmine',
    {
      cwd: path.resolve(`fixtures/${fixture}`),
      env: Object.assign({}, process.env, env)
    }
  );
  return child.stdout;
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

  it('installs the async override by default', async function() {
    const output = await cli('async_override');
    expect(output).toContain('2 specs, 0 failures');
    const [, duration] = output.match(/Finished in ([\d.]+) seconds/);
    expect(Number(duration)).toBeGreaterThan(5);
  }, 10000);
});
