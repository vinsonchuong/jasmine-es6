import * as path from 'path';
import {childProcess} from 'node-promise-es6';
import * as fse from 'fs-extra-promise-es6';
import {specFiles} from 'jasmine-es6/lib/reflect';

describe('reflect', () => {
  beforeEach(async () => {
    await fse.mkdirs(path.resolve('spec/support'));
  });

  afterEach(async () => {
    await fse.remove(path.resolve('project'));
    await fse.remove(path.resolve('spec/support'));
  });

  describe('#specFiles', () => {
    it('returns an array of spec files', async () => {
      const {stdout} = await childProcess.exec(
        `find '${path.resolve('spec')}' -type f`);
      const expectedFiles = stdout.trim().split('\n');

      const actualFiles = await specFiles();

      expect(actualFiles.sort()).toEqual(expectedFiles.sort());
    });

    it('respects jasmine.json configuration', async () => {
      await fse.writeJson(path.resolve('spec/support/jasmine.json'), {
        spec_dir: 'spec',
        spec_files: [
          'lib/reflect_*.js'
        ]
      });

      const expectedFiles = [
        path.resolve('spec/lib/reflect_spec.js')
      ];

      const actualFiles = await specFiles();

      expect(actualFiles.sort()).toEqual(expectedFiles.sort());
    });
  });
});
