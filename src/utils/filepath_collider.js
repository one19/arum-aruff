/**
 * Slams two arrays of filepaths together, and gives back an absolute
 * filepath to where you're going in object traversal speak
 *
 * ['project', 'src'] & ['..', 'flingle.js'] => ['project', 'flingle.js']
 *
 * @function filepathCollider
 * @param {[string]} fileTreePath from root to where you are
 * @param {[string]} relativeFilePath relative path from that location
 * @returns {[string]} simplified path from tree root to relative location
 */
export default (projectFilePath, relativeFilePath) => {
  const returnPath = JSON.parse(JSON.stringify(projectFilePath));

  relativeFilePath.forEach(pathChunk => {
    switch (pathChunk) {
      case '..':
        returnPath.pop();
        break;
      case '.':
        break;
      case '/':
        returnPath.length = 1;
        break;
      case '~':
        returnPath.length = 1;
        returnPath.push('src');
        break;
      default:
        returnPath.push(pathChunk);
        break;
    }
  });

  return returnPath;
};
