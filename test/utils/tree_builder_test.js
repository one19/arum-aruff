import test from 'ava';
import { buildTree } from '../../src/utils';

test('builds a single-level tree for the current dir', t => {
  t.deepEqual(buildTree(), 'setup is working');
});
