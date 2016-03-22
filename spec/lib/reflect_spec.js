import * as fse from 'fs-extra-promise-es6';
import Directory from 'directory-helpers';

describe('reflect', () => {
  afterEach(async () => {
    await new Directory('project').remove();
  });

  describe('#configPath', () => {
    it('returns the default config when the project does not provide a jasmine.json', async () => {
      const project = new Directory('project');
      await project.create();
      const result = await project.execJs(`
        import {configPath} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(await configPath());
        }
        run();
      `);

      expect(result).toBe(require.resolve('jasmine-es6/config/jasmine.json'));
    });

    it('returns the provided config when the project provides a jasmine.json', async () => {
      const project = new Directory('project');
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        }
      });
      const result = await project.execJs(`
        import {configPath} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(await configPath());
        }
        run();
      `);

      expect(result).toBe(project.path('spec/support/jasmine.json'));
    });
  });

  describe('#config', () => {
    it('returns the default config when the project does not provide a jasmine.json', async () => {
      const project = new Directory('project');
      await project.create();
      const result = await project.execJs(`
        import {config} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(JSON.stringify(await config()));
        }
        run();
      `);
      expect(JSON.parse(result))
        .toEqual(await fse.readJson(require.resolve('jasmine-es6/config/jasmine.json')));
    });

    it('returns the provided config', async () => {
      const project = new Directory('project');
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        }
      });
      const result = await project.execJs(`
        import {config} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(JSON.stringify(await config()));
        }
        run();
      `);
      expect(JSON.parse(result)).toEqual({
        spec_dir: 'spec',
        spec_files: ['**/*_spec.js']
      });
    });
  });

  describe('#specFiles', () => {
    it('returns an array of spec files', async () => {
      const project = new Directory('project');
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        },
        'spec/index_spec.js': '',
        'spec/lib/foo_spec.js': ''
      });
      const result = await project.execJs(`
        import {specFiles} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(JSON.stringify(await specFiles()));
        }
        run();
      `);

      expect(JSON.parse(result)).toEqual([
        project.path('spec/index_spec.js'),
        project.path('spec/lib/foo_spec.js')
      ]);
    });
  });
});
