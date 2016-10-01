# jasmine-es6
[![Build Status](https://travis-ci.org/vinsonchuong/jasmine-es6.svg?branch=master)](https://travis-ci.org/vinsonchuong/jasmine-es6)

Helpers and overrides that augment [Jasmine](http://jasmine.github.io) for use
in an ES6+ environment

## Installing
`jasmine-es6` is available as an
[npm package](https://www.npmjs.com/package/jasmine-es6) and is meant to be
installed in place of the `jasmine` package.

## Usage

### CLI
`jasmine-es6` provides a `jasmine` executable, meant to be used in place of
the executable provided by the `jasmine` package. It runs a project's Jasmine
specs in a [Babel](http://babeljs.io) environment, which transpiles ES6+ code
at runtime. `jasmine-es6` does not require a `jasmine.json` to be present; it
will fallback to the default `jasmine.json` that would be generated by running
`jasmine init`. The `JASMINE_CONFIG_PATH` environment variable is still
respected.

When using the CLI, the overrides listed below will be enabled. Note that if a
custom `jasmine.json` is used, the overrides will not be enabled by default.
`jasmine-es6/lib/install.js` must be added as a helper to the custom
`jasmine.json` as follows:

```json
{
  "spec_dir": "spec",
  "spec_files": [
    "**/*[sS]pec.js"
  ],
  "helpers": [
    "../node_modules/jasmine-es6/lib/install.js",
    "helpers/**/*.js"
  ]
}
```

### Overrides
Extend `it`, `beforeEach`, etc. with additional behavior. Either install
overrides individually (as shown below) or all at once:

```js
import install from 'jasmine-es6';
install();
```

#### Async
Adds support for `async` test cases by transforming them to use Jasmine's
`done` callback. Exceptions thrown by any `async` function calls are caught
and passed to Jasmine's `done.fail` callback.

```js
import fs from 'fs-promise';
import install from 'jasmine-es6/overrides/async';
install();

describe('Async', function() {
  beforeEach(async function() {
    this.contents = await fs.readFile('./package.json', 'utf8');
  });

  it('supports async-await test cases', async function() {
    const packageJson = JSON.parse(this.contents);
    expect(packageJson.name).toBe('jasmine-es6');
  });
});
```

Note that with this override installed, test cases will no longer be able to
access the `done` argument.

### Helpers
Functions and classes that enable more expressive and concise test cases.
Either `require` helpers individually (as shown below) or all at once:

```js
import {catchError, Promise} from 'jasmine-es6';
```

#### catchError
"Returns" the error message (`e.message`) of an `async` function call or
`undefined` if no error is thrown.

```js
import catchError from 'jasmine-es6/helpers/catch_error';
import install from 'jasmine-es6/overrides/async';
install();

describe('Async', function() {
  it('enables easy assertion on async errors', async function() {
    const errorMessage = await catchError(fs.readFile('does_not_exist', 'utf8'));
    expect(errorMessage).toMatch(/ENOENT/);
  });
});
```

## Development
### Getting Started
The application requires the following external dependencies:
* Node.js

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```
