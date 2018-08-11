import test from 'ava';
import { findUnused } from '../../src/utils';

test('handles simple movement up folder levels', t => {
  const tree = {
    'moople_doople.js': {},
    sawce: {
      _isDir: true,
      'moop.ts': { _imports: 900 },
      'floop.mdx': { _imports: 1 },
      morgle: {
        _isDir: true,
        'dawn.trm': {},
        'porgle.tsx': {},
        'flimpsey.j': { _imports: 1 }
      }
    }
  };
  const result = findUnused(tree);
  t.deepEqual(result, [
    './moople_doople.js',
    './sawce/morgle/dawn.trm',
    './sawce/morgle/porgle.tsx'
  ]);
});
