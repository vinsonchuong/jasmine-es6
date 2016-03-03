import * as path from 'path';
import {childProcess} from 'node-promise-es6';
import * as fse from 'fs-extra-promise-es6';
import {configPath, config, specFiles} from 'jasmine-es6/lib/reflect';

describe('reflect', () => {
  describe('#configPath', () => {
    describe('when the project does not provide a jasmine.json', () => {
      it('returns the default config', async () => {
        expect(await configPath())
          .toBe(require.resolve('jasmine-es6/config/jasmine.json'));
      });
    });

    describe('when the project provides a jasmine.json', () => {
      beforeEach(async () => {
        await fse.mkdirs(path.resolve('spec/support'));
        await fse.writeJson(path.resolve('spec/support/jasmine.json'), {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        });
      });
      afterEach(async () => {
        await fse.remove(path.resolve('spec/support'));
      });

      it('returns the provided config', async () => {
        expect(await configPath())
          .toBe(path.resolve('spec/support/jasmine.json'));
      });
    });
  });

  describe('#config', () => {
    describe('when the project does not provide a jasmine.json', () => {
      it('returns the default config', async () => {
        expect(await config()).toEqual(await fse.readJson(require.resolve('jasmine-es6/config/jasmine.json')));
      });
    });

    describe('when the project provides a jasmine.json', () => {
      beforeEach(async () => {
        await fse.mkdirs(path.resolve('spec/support'));
        await fse.writeJson(path.resolve('spec/support/jasmine.json'), {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        });
      });
      afterEach(async () => {
        await fse.remove(path.resolve('spec/support'));
      });

      it('returns the provided config', async () => {
        expect(await config()).toEqual({
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        });
      });
    });
  });

  describe('#specFiles', () => {
    beforeEach(async () => {
      await fse.mkdirs(path.resolve('spec/support'));
    });

    afterEach(async () => {
      await fse.remove(path.resolve('project'));
      await fse.remove(path.resolve('spec/support'));
    });

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
