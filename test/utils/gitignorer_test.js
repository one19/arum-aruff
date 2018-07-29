import test from 'ava';
import mock from 'mock-fs';
import { GitIgnorer } from '../../src/utils';

test.afterEach.always(() => mock.restore());

/* instantiation tests */
test.serial('reads a gitignore file', t => {
  mock({
    './.gitignore': 'node_modules'
  });

  const ignorer = new GitIgnorer();
  t.deepEqual(JSON.parse(JSON.stringify(ignorer)).gitignores, [{}, {}]);
});
test.serial('from anyplace, even outside ./', t => {
  mock({
    './src/.gitignore': 'node_modules'
  });

  const ignorer = new GitIgnorer('src');
  t.deepEqual(JSON.parse(JSON.stringify(ignorer)).gitignores, [{}, {}]);
});

/* tests that deal with filepath testing */
test.serial('tests instantiated things against a file path', t => {
  mock({
    '.gitignore': 'node_modules'
  });

  const ignorer = new GitIgnorer();
  t.true(ignorer.test('./node_modules'));
});
test.serial('ignores hidden files by default', t => {
  mock({
    '.gitignore': 'node_modules'
  });

  const ignorer = new GitIgnorer();
  t.true(ignorer.test('.gitignore'));
});
test.serial('ignores comments', t => {
  mock({
    '.gitignore': `
      #js-ey things: 1-2
      node_modules
      screeble.map*

      #wierd stuff 3-4
      flimflam-mcjam
      test
    `
  });

  const ignorer = new GitIgnorer();
  /* default hidden file ignore + the 4 valid strings in .gitignore */
  t.is(JSON.parse(JSON.stringify(ignorer)).gitignores.length, 5);
  t.false(ignorer.test('./src/features/morphing-time.js'));
  t.true(ignorer.test('./fleeb/gromble/screeble.map99'));
  t.true(ignorer.test('./test/gitignorer-test.js'));
  t.true(ignorer.test('.gitignore'));
});
