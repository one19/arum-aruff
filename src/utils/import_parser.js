const REQUIRE_RE = /require\(['"]{1}(\S+)['"]{1}.*/i;
const FROM_RE = /from\s+['"]{1}(\S+)['"]{1}.*/i;
const COMMA_RE = /,/g;

/**
 * Function to parse filestring and return an array of all imports
 * each import will be an array of the filepath traversal steps
 * needed to get that import
 * ie: ['..', '..', 'src', 'thatJsFile']
 *
 * TODO: think about attaching the function name
 *    right now, we're just using # of imports/exports for simplicity
 *    this *will* miss things like a function getting exported but unused
 *
 * @function parseImports
 * @param {string} [fileContents=.] complete file contents
 * @returns {[[string]]} array of array of strings
 */
export default (fileContents = '') => {
  // firstly, replace multi-line imports with single-line variants. Then
  // split into lines, remove leading/trailing whitespace, & remove blanks
  const lines = fileContents
    .replace(/(\{|,)\s*[\n|\r]/gi, '$1')
    .replace(/[\n\r]\s*}/gi, ' }')
    .split(/[\n\r]/)
    .map(e => e.trim())
    .filter(Boolean);

  return lines.reduce((imports, line) => {
    const foundFrom = FROM_RE.exec(line) || [];
    const foundRequire = REQUIRE_RE.exec(line) || [];

    const importName = foundFrom[1] || foundRequire[1];
    if (!importName) return imports;

    const importPathArray = importName.split('/');
    if (importName[0] === '/') importPathArray[0] = '/';

    const extraImports = (line.match(COMMA_RE) || []).length;

    return imports.concat(
      Array.from(new Array(1 + extraImports), () => importPathArray)
    );
  }, []);
};
