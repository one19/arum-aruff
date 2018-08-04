import fs from 'fs';

/**
 * Package.json is a special import case.
 * To support assumed global path/root imports, we need a list of deps.
 * That way, if the import isn't from the prepopulated package.json
 * you can try and look into the tree for a virtual pathfile instead
 *
 * @async
 * @function depsPopulator
 * @param {string} [path=.] root directory
 * @returns {Promise} promise that resolves to a keyed object of deps with 0 as their import #
 */
export default (path = '.') => {
  const depsRegex = /dependencies/i;
  let packageObj;

  try {
    // unable to use promises fs readfile because mock-fs doesn't support it well yet
    const packageContents = fs.readFileSync(`${path}/package.json`, {
      encoding: 'utf8'
    });
    packageObj = JSON.parse(packageContents);
  } catch (err) {
    console.error(`failed to parse package.json in root: ${path}/`, err);
  }

  const depsList = Object.keys(packageObj).reduce((deps, packageKey) => {
    return depsRegex.test(packageKey)
      ? deps.concat(Object.keys(packageObj[packageKey]))
      : deps;
  }, []);

  return depsList.reduce(
    (packageDepsObject, depName) => ({ ...packageDepsObject, [depName]: {} }),
    {}
  );
};
