import { promises as fs } from 'fs';
import { default as GitIgnorer } from './gitignorer';

const buildTree = async path => {
  const ignorer = new GitIgnorer(path);

  return traverseTree(path, ignorer.test);
};

/**
 * Function fires off a nasty load of promises and tries
 * to generate a bare and easily traversible tree object
 * of the filesystem, at the location, defaulting to ./
 *
 * @async
 * @function traverseTree
 * @param {string} [path=.] root directory
 * @returns {Promise} promise that resolves to a dir tree or breaks
 */
const traverseTree = async (path = '.', ignorer = () => {}) => {
  const stats = await fs.stat(`${path}`);

  if (stats.isDirectory()) {
    const subdirs = await fs.readdir(`${path}`);

    const filteredSubdirs = subdirs.filter(ignorer);

    const subBranches = await Promise.all(
      filteredSubdirs.map(dirname =>
        traverseTree(`${path}/${dirname}`, ignorer)
      )
    );

    const subTree = filteredSubdirs.reduce(
      (thisTree, dirname, i) => ({ ...thisTree, [dirname]: subBranches[i] }),
      {}
    );

    return { ...subTree, _isDir: true };
  }

  return {};
};

export default buildTree;
