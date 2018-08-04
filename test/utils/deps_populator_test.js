import test from 'ava';
import mock from 'mock-fs';
import { depsPopulator } from '../../src/utils';

test.afterEach.always(() => mock.restore());

/* instantiation tests */
test.serial('reads a package.json file into base empty tree setup', t => {
  mock({
    './dingle/package.json': `
    {
      "name": "fake",
      "version": "0.0.0",
      "description": "is really fake",
      "main": "dist/src/index.js",
      "repository": "git@github.com:one19/arum-aruff.git",
      "author": "Drew Showalter <maelstroswim@gmail.com>",
      "scripts": {
        "test": "ava"
      },
      "ava": {
        "require": [
          "babel-register"
        ],
        "cache": false
      },
      "dependencies": {
        "markov-json": "0.1.19"
      },
      "devDependencies": {
        "ava": "^0.25.0",
        "babel-eslint": "^8.2.6",
        "nyc": "^12.0.2",
        "parcel-bundler": "^1.9.4",
        "prettier": "^1.12.1"
      }
    }`
  });

  const deps = depsPopulator('./dingle');
  t.deepEqual(deps, {
    ava: {},
    'babel-eslint': {},
    'markov-json': {},
    nyc: {},
    'parcel-bundler': {},
    prettier: {}
  });
});
