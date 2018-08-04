import test from 'ava';
import { parseImports } from '../../src/utils';

/* testing various 'no-path' imports */
test('reads various import methods for external-like modules', t => {
  const file = `
    import { promises as fs, readFileSync } from '@dorp/fs';
    import MarkovJson from "markov-json";
    import ava, { * as ava } from 'ava/flingles';

    let butt = require('chalk');
    var {
      some: sOmE,
      more,
      stuff
    } = require('lodash/capitalize').inputsawce // eslint-disable
    require("console-frog");

    export {moose: mooses} from 'mousse_js'
    export * from '@one19/use-less';;
    module.exports = require('zekrom');
    module.exports.monster = require('src/evee');
`;

  const deps = parseImports(file);
  t.deepEqual(deps, [
    ['@dorp', 'fs'],
    ['@dorp', 'fs'],
    ['markov-json'],
    ['ava', 'flingles'],
    ['ava', 'flingles'],
    ['chalk'],
    ['lodash', 'capitalize'],
    ['lodash', 'capitalize'],
    ['lodash', 'capitalize'],
    ['console-frog'],
    ['mousse_js'],
    ['@one19', 'use-less'],
    ['zekrom'],
    ['src', 'evee']
  ]);
});

/* testing various path-like imports */
test('tries to be helpful with pathfinding params', t => {
  const file = `
    import { promises as fs, readFileSync } from '/../@dorp/fs';
    const { 
      flomices as fs,
      *: foob,
      fopTopplington
    } = require('~/../fleeb.ts');
    import MarkovJson from "./markov-json.json";
    import ava, { * as ava } from '../../ava/flingles';

    module.exports.monster = require('src/evee');
`;

  const deps = parseImports(file);
  t.deepEqual(deps, [
    ['/', '..', '@dorp', 'fs'],
    ['/', '..', '@dorp', 'fs'],
    ['~', '..', 'fleeb.ts'],
    ['~', '..', 'fleeb.ts'],
    ['~', '..', 'fleeb.ts'],
    ['.', 'markov-json.json'],
    ['..', '..', 'ava', 'flingles'],
    ['..', '..', 'ava', 'flingles'],
    ['src', 'evee']
  ]);
});
