import test from 'ava';
import mock from 'mock-fs';
import arum from '../src';

test.afterEach.always(() => mock.restore());

test.serial('does simple import weight analysis', async t => {
  mock({
    'package.json': `{
      "dependencies": {
        "markov-json": "a-version",
        "ava": "totes-real-version-#"
      }
    }`,
    '.gitignore': '#this must be here to keep mock-fs from dying',
    'index.js': "import stuff from './src/doSomething';",
    src: {
      'doSomething.js': `
        import MK from 'markov-json';
        let basically_nothing = "doing";
      `,
      'unused.js': 'const fleeb = require("ava");'
    }
  });

  const analysis = await arum();

  t.deepEqual(analysis, ['./index.js', './src/unused.js']);
});

test.serial('ignores /test for now', async t => {
  mock({
    'package.json': `{
      "devDependencies": {
        "ava": "totes-real-version-#"
      }
    }`,
    '.gitignore': '#this must be here to keep mock-fs from dying',
    'index.js': "import stuff from './src/doSomething';",
    test: {
      'doSomething.js': 'test-junk ok',
      'moreTests.ts': 'const fleeb = require("ava");'
    }
  });

  const analysis = await arum();

  t.deepEqual(analysis, ['./index.js']);
});
