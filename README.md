# package-dependencies-file-paths [![Build Status](https://travis-ci.org/huhgawz/package-dependencies-file-paths.svg?branch=master)](https://travis-ci.org/huhgawz/package-dependencies-file-paths)

> Resolve dependencies file paths in a `package.json`.

## Install

```
$ npm install --save package-dependencies-file-paths
```

## Usage

```js
var packageDependenciesFilePaths = require('package-dependencies-file-paths');

var cwd = process.cwd();
var options = {
  transformPath: function(folderPath) {
    return folderPath.replace(cwd + '/', '');
  },
  sort: true
};
var pkgJson = require('./package.json');
packageDependenciesFilePaths(pkgJson, options, function(err, filePaths) {
  if(err) return console.error(err);
  console.log('filePaths:', JSON.stringify(filePaths, null, 4));
});
```

## API

### packageDependenciesFilePaths(packageJson, [options], [callback])

Resolve dependencies file paths in `packageJson`.

#### packageJson

Type: `Object`

`package.json` Object.

#### options

Type: `Object`

## License

MIT © Huhgawz
