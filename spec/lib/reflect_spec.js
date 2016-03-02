import * as path from 'path';
import {childProcess} from 'node-promise-es6';
import * as fse from 'fs-extra-promise-es6';
import {specFiles} from 'jasmine-es6/lib/reflect';

describe('reflect', () => {
  afterEach(async () => {
    await fse.remove(path.resolve('project'));
  });

  describe('#specFiles', () => {
    it('returns an array of spec files', async () => {
      const {stdout} = await childProcess.exec(
        `find '${path.resolve('spec')}' -type f`);
      const expectedFiles = stdout.trim().split('\n');

      const actualFiles = await specFiles();

      expect(actualFiles.sort()).toEqual(expectedFiles.sort());
    });
  });
});
