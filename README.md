# ARUM-ARUFF

### WHAT IT DO:
Builds a tree of your app, and tells you what components/packages should/might be easiest to delete

### HOW TO RUN IT:
```sh
  npm i -g arum-aruff
  cd PROJECT_FOLDER
  arum-aruff
```

### MORE ABOUT IT:

### DEV NOTES:
* Tests are a *nightmare*. `fs` mocking with generally non-serial `ava` means any test failures will look **horrifying and nonsensical**. You'll never be able to tell what's wrong for the most part. Just assume any changes that start failing are the latest thing you've done.


### TODO:
1. It would be nice to use `promises as fs` for every file system call, but `mock-fs` doesn't seem to support the call mocks yet. Any `readFileSync` can easily be replaced with a `promisify` fix to speed things up if the current sync system is too slow. Eventually then replacing that with `fs.promises`
2. 