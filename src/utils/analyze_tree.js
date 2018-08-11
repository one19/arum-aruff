import fs from 'fs';
import parseImports from './import_parser';
import filepathCollider from './filepath_collider';

/**
 * Recursively walks the given tree.
 * As it moves, reads each file in the tree, and gets their imports.
 * Uses these imports to mutate the tree with import weights.
 *
 * @param {object} fullTree a treetype created by tree_builder
 * @param {[string]} [pathArray=[]] the current(recurse) path split on /s
 * @param {object} [treePortion=fullTree] the current level sub-part of the tree
 */
const analyzeTree = (fullTree, pathArray = [], treePortion = fullTree) => {
  const filesAndFolders = Object.keys(treePortion).filter(e => e[0] !== '_');

  filesAndFolders.forEach(name => {
    if (treePortion[name]._isDir) {
      return analyzeTree(fullTree, [...pathArray, name], treePortion[name]);
    }

    const fileContents = fs.readFileSync(`${pathArray.join('/')}/${name}`, {
      encoding: 'utf8'
    });
    const fileImports = parseImports(fileContents);

    fileImports.forEach(importPath => {
      const treeNav = filepathCollider(pathArray, importPath);
      if (treeNav.length === 0) {
        return console.warn(
          `Root nav failure on file ${pathArray.join('/')}, continuing.`
        );
      }

      // stop to check if it's a package
      const localImport = (importPath[0] || '').match(/^[.\/~]/);
      if (!localImport) {
        const packageNames = Object.keys(fullTree['package.json']);
        const isPackage = packageNames.find(e => e === treeNav[0]);

        // TODO: HANDLE MULTIPLE MATCHES/NAMESPACED PACKAGES
        if (isPackage) {
          return fullTree['package.json'][isPackage]._imports
            ? (fullTree['package.json'][isPackage]._imports += 1)
            : (fullTree['package.json'][isPackage]._imports = 1);
        }
      }

      return treeNav.reduce((objectPart, pathVar, i) => {
        if (!objectPart) return;
        // on the final location of the path traversal, assign imports weight
        if (i === treeNav.length - 1) {
          const partFileNames = Object.keys(objectPart);
          const foundFileName = partFileNames.find(filename =>
            filename.includes(pathVar)
          );

          if (foundFileName) {
            // don't assign function requires to the folder, but to the index
            // within the folder.
            if (objectPart[foundFileName]._isDir) {
              const files = Object.keys(objectPart[foundFileName]);
              const folderIndex = files.find(e => e.match(/^index\./gi));
              if (!folderIndex) {
                return console.warn(
                  `Broken index import at: ${pathArray.join('/')}, continuing.`
                );
              }
              return objectPart[foundFileName][folderIndex]._imports
                ? (objectPart[foundFileName][folderIndex]._imports += 1)
                : (objectPart[foundFileName][folderIndex]._imports = 1);
            }
            return objectPart[foundFileName]._imports
              ? (objectPart[foundFileName]._imports += 1)
              : (objectPart[foundFileName]._imports = 1);
          }
        }

        // keep traversing downward
        return objectPart[pathVar];
      }, fullTree);
    });
  });

  return fullTree;
};

export default analyzeTree;
