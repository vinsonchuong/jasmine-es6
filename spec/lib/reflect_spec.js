import * as path from 'path';
import {childProcess, fs} from 'node-promise-es6';
import * as fse from 'fs-extra-promise-es6';

class Project {
  path(...args) {
    return path.resolve('project', ...args);
  }

  async write(files) {
    for (const filePath of Object.keys(files)) {
      const absolutePath = this.path(filePath);
      const fileContents = files[filePath];
      await fse.ensureFile(absolutePath);
      if (typeof fileContents === 'object') {
        await fse.writeJson(absolutePath, fileContents);
      } else {
        await fs.writeFile(absolutePath, fileContents);
      }
    }
  }

  async run(code) {
    await this.write({
      'run.js': "require('dist-es6/lib/run')(require('path').resolve('./code'))",
      'code.js': code
    });

    const {stdout: output} = await childProcess.exec(
      'node run.js',
      {
        cwd: this.path()
      }
    );
    return output.trim();
  }
}

describe('reflect', () => {
  afterEach(async () => {
    await fse.remove(path.resolve('project'));
  });

  describe('#configPath', () => {
    it('returns the default config when the project does not provide a jasmine.json', async () => {
      const project = new Project();
      const result = await project.run(`
        import {configPath} from 'jasmine-es6/lib/reflect';
        async function run() {
          process.stdout.write(await configPath());
        }
        run();
      `);

      expect(result).toBe(require.resolve('jasmine-es6/config/jasmine.json'));
    });

    it('returns the provided config when the project provides a jasmine.json', async () => {
      const project = new Project();
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        }
      });
      const result = await project.run(`
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
      const project = new Project();
      const result = await project.run(`
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
      const project = new Project();
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        }
      });
      const result = await project.run(`
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
      const project = new Project();
      await project.write({
        'spec/support/jasmine.json': {
          spec_dir: 'spec',
          spec_files: ['**/*_spec.js']
        },
        'spec/index_spec.js': '',
        'spec/lib/foo_spec.js': ''
      });
      const result = await project.run(`
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
