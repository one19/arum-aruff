import test from 'ava';
import { filepathCollider } from '../../src/utils';

test('handles simple movement up folder levels', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['..', 'utils'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['projectDir', 'utils']);
});

test('handles simple movement within a folder', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['.', 'thingo.js'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['projectDir', 'helpers', 'thingo.js']);
});

test('refuses to navigate above root', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['..', '..', '..', '..', 'utils'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['utils']);
});

/* iffy pieces of functionality */
test('attempts to understand what root nav means', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['/', 'thingo.js'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['projectDir', 'thingo.js']);
});
test('does the same thing to relativedir', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['~', 'thingo.js'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['projectDir', 'src', 'thingo.js']);
});
