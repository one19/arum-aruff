/**
 * given a tree, recurses it, and returns all files that go unused
 *
 * @param {object} treePart section of tree to traverse down & look through
 * @param {string} [path='.'] path to this section of tree
 */
const findUnused = (treePart, path = '.') => {
  const nextLevelNames = Object.keys(treePart).filter(e => e[0] !== '_');

  return nextLevelNames.reduce((unused, name) => {
    const pathName = `${path}/${name}`;

    if (treePart[name]._isDir) {
      return unused.concat(findUnused(treePart[name], pathName));
    }

    return treePart[name]._imports ? unused : unused.concat(pathName);
  }, []);
};

export default findUnused;
