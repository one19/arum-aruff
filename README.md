# ARUM-ARUFF

[![Known Vulnerabilities](https://snyk.io/test/github/one19/arum-aruff/badge.svg)](https://snyk.io/test/github/one19/arum-aruff) [![Testing Status] [![Test Coverage](https://api.codeclimate.com/v1/badges/7655d8c0ae2f0ed87564/test_coverage)](https://codeclimate.com/github/one19/arum-aruff/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/7655d8c0ae2f0ed87564/maintainability)](https://codeclimate.com/github/one19/arum-aruff/maintainability)
---

### WHAT IT DO:
Builds a tree of your app, and tells you what components/packages should/might be easiest to delete!

### HOW TO RUN IT:
```sh
  npm i -g arum-aruff
  cd SOME_PROJECT_FOLDER
  arum-aruff
```

### DEV NOTES:
* Tests are a *nightmare*. `fs` mocking with generally non-serial `ava` means any test failures will look **horrifying and nonsensical**. You'll never be able to tell what's wrong for the most part. Just assume any changes that start failing are the latest thing you've done.


### TODO:
1. `fsPromises` fail to work well with `package.json` files, refactoring when `mock-fs` works correctly would be nice.
2. `package.json` deps that aren't imported anywhere reporting
3. `CI` testing & `one19/project-status` integrations
4. a happy little `svg` icon of a pupper and a glass of rum
5. `export` strength mapping
6. tracing imports & exports from file to function name
7. Baller d3 web
8. `_size` reporting for tree/single-file lines of code/bits
9. parsing `test` configs or allowing to have a `-i` input to allow ignoring **any** regex
