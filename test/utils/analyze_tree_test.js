import test from 'ava';
import mock from 'mock-fs';
import { analyzeTree } from '../../src/utils';

test.afterEach.always(() => mock.restore());

test.serial('adds analysis to a tree', async t => {
  mock({
    'package.json': 'here so test succeeds',
    'index.js': "import stuff from './src/doSomething';",
    src: {
      'doSomething.js': `
        import MK from 'markov-json';
        let basically_nothing = "doing";
      `,
      'unused.ts': 'const fleeb = require("ava");'
    }
  });

  const tree = {
    _isDir: true,
    'index.js': {},
    'package.json': { ava: {}, 'markov-json': {} },
    src: {
      _isDir: true,
      'doSomething.js': {},
      'unused.ts': {}
    }
  };

  const analysis = await analyzeTree(tree, ['.']);

  t.deepEqual(analysis, {
    'index.js': {},
    'package.json': {
      'markov-json': { _imports: 1 },
      ava: { _imports: 1 }
    },
    src: {
      'doSomething.js': { _imports: 1 },
      'unused.ts': {},
      _isDir: true
    },
    _isDir: true
  });
});
