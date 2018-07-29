import test from 'ava';
import mock from 'mock-fs';
import { buildTree } from '../../src/utils';

test.afterEach.always(() => mock.restore());

test.serial('creates object tree of a directory', async t => {
  mock({
    folder_bingo: {
      '.gitignore': 'this must be here to keep mock-fs from dying',
      'index.js': "import stuff from './src/doSomething';",
      src: {
        'doSomething.js': 'let basically_nothing = "doing";'
      }
    }
  });

  const tree = await buildTree('./folder_bingo');

  t.deepEqual(tree, {
    src: { dir: true, 'doSomething.js': {} },
    'index.js': {},
    dir: true
  });
});

test.serial('defaults to ./ when not given a dir', async t => {
  mock({
    '.gitignore': 'primble',
    'index.js': "import stuff from './src/doSomething';"
  });

  const tree = await buildTree();

  t.deepEqual(tree, {
    'index.js': {},
    dir: true
  });
});

test.serial('ignores . & gitignored folders/files defined in ./', async t => {
  mock({
    'index.js': "import stuff from './src/doSomething';",
    '.gitignore': `
      node_modules
      *.map
    `,
    node_modules: {
      lots: { of: { junk: 'like wow' } }
    },
    fleeb: { plumbus: { 'dingle.map': 'c[r]a[z]y' } }
  });

  const tree = await buildTree();

  t.deepEqual(tree, {
    fleeb: { plumbus: { dir: true }, dir: true },
    'index.js': {},
    dir: true
  });
});
