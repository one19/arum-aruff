import test from 'ava';
import { filepathCollider } from '../../src/utils';

test('handles simple movement up folder levels', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['..', 'utils'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['utils']);
});

test('handles simple movement within a folder', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['.', 'thingo.js'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['helpers', 'thingo.js']);
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
  t.deepEqual(result, ['thingo.js']);
});
test('does the same thing to relativedir', t => {
  const currentLocation = ['projectDir', 'helpers'];
  const relativeImportLocation = ['~', 'thingo.js'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['src', 'thingo.js']);
});

/* packages and globals */
test('handles package invocation well', t => {
  const currentLocation = ['projectDir', 'helpers', 'fleem'];
  const relativeImportLocation = ['markov-json'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['markov-json']);
});
test('treats global imports and packages the same way', t => {
  const currentLocation = ['projectDir', 'helpers', 'floob'];
  const relativeImportLocation = ['src', 'stinger'];
  const result = filepathCollider(currentLocation, relativeImportLocation);
  t.deepEqual(result, ['src', 'stinger']);
});
