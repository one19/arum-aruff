import { default as fs } from 'fs';

/**
 * Grabs a .gitignore file from root, constructs some regexes,
 * and returns a matching function of them for use
 *
 * @async
 * @function gitIgnorer
 * @param {string} [path=./] root directory
 * @returns {Promise} promise that resolves to a dir tree or breaks
 */
class GitIgnorer {
  gitignores = [/^\.\w+/i];

  constructor(path = '.') {
    let contents = '';

    try {
      contents = fs.readFileSync(`${path}/.gitignore`, {
        encoding: 'utf8'
      });
    } catch (err) {
      console.error('unable to find .gitignore', err);
    }

    contents
      .split(/(\n|\r)/gi)
      .map(entry =>
        entry
          .replace('**', '')
          .replace(/\s+/gi, '')
          .replace(/\.+/g, '\\.')
          .replace(/\*{1}/g, '.*')
      )
      .filter(entry => entry[0] !== '#')
      .filter(Boolean)
      .forEach(entry => {
        let regEntry;

        try {
          regEntry = new RegExp(entry);
        } catch (_) {
          console.error("couldn't parse to regex: ", entry);
        }

        regEntry && this.gitignores.push(new RegExp(regEntry));
      });
  }

  test = filePath => {
    return this.gitignores.reduce((foundMatch, ignore) => {
      if (ignore.test(filePath)) return false;
      return foundMatch;
    }, true);
  };
}

export default GitIgnorer;
