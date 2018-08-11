import { buildTree, analyzeTree, depsPopulator, findUnused } from './utils';

/**
 * A function that maps an application, and returns an import web
 * of strengths for each file within. Can be used to see which files
 * have gone unused in a project, or are overweight, underutilised,
 * or good candidates for module creation or deletion.
 *
 * TODO: the export weight isn't yet assigned, nor are functions
 *    declared in such a way that you can track their names.
 *    both would be good features; in that order.
 * ALSO TODO LOL: fs is sync again because of our jank fs-mock lib /:
 *
 * @async
 * @function arum
 * @param {string} [rootPath] directory to analyse
 * @returns {object} state tree with import statistics.
 *    Should tree in the same way as the filesystem,
 *    but import weights will be according to use regardless
 *    of where the file is in physical space
 */
export default async rootPath => {
  const fileTree = await buildTree(rootPath);

  fileTree['package.json'] = depsPopulator(rootPath);

  const analyzedTree = analyzeTree(fileTree, [(rootPath = '.')]);

  const emptyFiles = findUnused(analyzedTree).filter(
    e => !e.match('package.json')
  );

  if (emptyFiles.length > 0) {
    console.log('Unused files found:\n', JSON.stringify(emptyFiles, null, 2));
  }

  return emptyFiles;
};
