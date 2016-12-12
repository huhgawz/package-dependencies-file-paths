# package-dependencies-file-paths

[![npm package](https://nodei.co/npm/package-dependencies-file-paths.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/package-dependencies-file-paths/)

[![Build Status](https://travis-ci.org/huhgawz/package-dependencies-file-paths.svg?branch=master)](https://travis-ci.org/huhgawz/package-dependencies-file-paths)
[![NPM Version](http://img.shields.io/npm/v/package-dependencies-file-paths.svg?style=flat)](https://www.npmjs.org/package/package-dependencies-file-paths)
[![NPM Downloads](https://img.shields.io/npm/dm/package-dependencies-file-paths.svg?style=flat)](https://www.npmjs.org/package/package-dependencies-file-paths)
[![Dependency Status](https://img.shields.io/david/huhgawz/package-dependencies-file-paths.svg?style=flat-square)](https://david-dm.org/huhgawz/package-dependencies-file-paths)
[![Known Vulnerabilities](https://snyk.io/test/npm/package-dependencies-file-paths/badge.svg?style=flat-square)](https://snyk.io/test/npm/package-dependencies-file-paths)

> Resolve dependencies file paths in a `package.json`.

## Install

```
$ npm install --save package-dependencies-file-paths
```

## Usage

### File Structure

```
├── node_modules
│   ├─ ...
│   ├─ globby
│   ├─ lodash
│   └─ ...
├── example.js
└── package.json
```

### package.json

```js
{
  //...
  "dependencies": {
    //...
    "globby": "~6.1.0",
    "lodash": "~4.17.2",
    //...
  },
  //...
}
```

### example.js

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
  console.log(JSON.stringify(filePaths, null, 4));
  // Do something with file paths such as zip them and deploy them to the ☁️
});
```

Output from code above should look like this:

```js
[
  //...
  "node_modules/glob/common.js",
  "node_modules/glob/glob.js",
  "node_modules/glob/package.json",
  //...
  "node_modules/globby/index.js",
  "node_modules/globby/package.json",
  //...
  "node_modules/jade/node_modules/commander/lib/commander.js",
  "node_modules/jade/node_modules/commander/index.js",
  "node_modules/jade/node_modules/commander/package.json",
  //...
  "node_modules/lodash/fp/__.js",
  "node_modules/lodash/fp/_baseConvert.js",
  //...
  "node_modules/pinky_promise/index.js",
  "node_modules/pinky_promise/package.json",
  //...
]
```

## API

### packageDependenciesFilePaths(packageJson, [options], [callback])

Resolve dependencies file paths in `packageJson`.

#### packageJson

Type: `Object`

`package.json` Object.

#### options

Type: `Object`

##### lookups

Type: `String[]`

Possible Values: `dependencies`, `devDependencies`, `peerDependencies`

Default: `["dependencies"]`

##### sort

Type: `Boolean`

Default: `false`

##### include

Type: `String[]`

Default:

```js
[
  "**/*.{js,json,yml}"
]
```

See `node-glob` [glob-primer](https://github.com/isaacs/node-glob#glob-primer)

##### ignore

Type: `String[]`

Default:

```js
 [
    "**/{doc,docs,example,examples,fixture,fixtures,spec,test,tests}/**/*.{js,json,yml}",
    "**/*.{spec,test}.js",
    "**/{bower,component}.json",
    "**/{gulpfile,Gruntfile}.js",
    "**/{.,}{eslint,eslintrc,jscs,jscsrc}.json",
    "**/{.,}travis.yml"
]
```
See `node-glob` [glob-primer](https://github.com/isaacs/node-glob#glob-primer)

#### callback

Type: `Function`

##### err

Type: `Error`

##### filePaths

Type: `String[]`

## License

MIT © Huhgawz
