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

`package.json`

```javascript
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

```
├── node_modules
│   ├─ ...
│   ├─ globby
│   ├─ lodash
│   └─ ...
└── package.json
```

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
  /*
    Line above should log something like this:
    filePaths: [
      ...
      "node_modules/glob/common.js",
      "node_modules/glob/glob.js",
      "node_modules/glob/package.json",
      ...
      "node_modules/globby/index.js",
      "node_modules/globby/package.json",
      ...
      "node_modules/jade/node_modules/commander/lib/commander.js",
      "node_modules/jade/node_modules/commander/index.js",
      "node_modules/jade/node_modules/commander/package.json",
      ...
      "node_modules/lodash/fp/__.js",
      "node_modules/lodash/fp/_baseConvert.js",
      ...
      "node_modules/pinky_promise/index.js",
      "node_modules/pinky_promise/package.json",
      ...
    ]
  */
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

```json
[
  "**/*.{js,json,yml}"
]
```

##### ignore

Type: `String[]`

Default:

```json
 [
    "**/{doc,docs,example,examples,spec,test,tests}/**/*.{js,json,yml}",
    "**/*.{spec,test}.js",
    "**/{gulpfile,Gruntfile}.js",
    "**/{.,}{bower,component,eslint,eslintrc,jscs,travis}.{json,yml}"
]
```

#### callback

Type: `Function`

## License

MIT © Huhgawz
