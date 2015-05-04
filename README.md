# jasmine-es6
[![Build Status](https://travis-ci.org/vinsonchuong/jasmine-es6.svg?branch=master)](https://travis-ci.org/vinsonchuong/jasmine-es6)

Helpers and overrides that augment [Jasmine](http://jasmine.github.io) for use
in an ES6+ environment

## Installing
`jasmine-es6` is available as an
[npm package](https://www.npmjs.com/package/jasmine-es6).

## Usage

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

#### Promise
An experimental  `Promise` subclass for injecting into the implementation
under test. It provides `resolve` and `reject` methods for controlling the
promise. `resolve` and `reject` also return a promise that is resolved when all
listeners are finished executing.

```js
import TestPromise from 'jasmine-es6/helpers/promise';
import install from 'jasmine-es6/overrides/async';
install();

const implementation = {
  fetch(url) { return new Promise((resolve, reject) => '') },
  async doStuff() {
    this.showSpinner = true;
    await fetch('https://google.com');
    this.showSpinner = false;
  }
}

describe('Promise', function() {
  it('makes it easier to time assertions correctly', async function() {
    const promise = new TestPromise();
    spyOn(implementation, 'fetch').and.returnValue(promise);
    implementation.doStuff();
    expect(implementation.showSpinner).toBe(true);
    await promise.resolve();
    expect(implementation.showSpinner).toBe(false);
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
