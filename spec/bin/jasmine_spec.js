import path from 'path';
import {childProcess} from 'node-promise-es6';

async function cli(fixture, env = null) {
  const child = await childProcess.exec(
    'jasmine',
    {
      cwd: path.resolve(__dirname, `../../fixtures/${fixture}`),
      env: Object.assign({}, process.env, env)
    }
  );
  return child.stdout;
}

describe('jasmine-es6', () => {
  it('uses spec/support/jasmine.json if it exists', async () => {
    expect(await cli('with_jasmine_json'))
      .toContain('1 spec, 0 failures');
  });

  it('uses the default jasmine.json if spec/support/jasmine.json does not exist', async () => {
    expect(await cli('without_jasmine_json'))
      .toContain('1 spec, 0 failures');
  });

  it('allows configuring the jasmine.json path via environment variable', async () => {
    expect(await cli(
      'with_jasmine_json',
      {
        JASMINE_CONFIG_PATH: 'spec/support/jasmine2.json'
      }
    )).toContain('No specs found');
  });

  it('installs the async override by default', async () => {
    const output = await cli('async_override');
    expect(output).toContain('2 specs, 0 failures');
    const [, duration] = output.match(/Finished in ([\d.]+) seconds/);
    expect(Number(duration)).toBeGreaterThan(5);
  }, 10000);
});
