'use strict';

var _ = require('lodash');
var globby = require('globby');
var resolveTree = require('resolve-tree');

var DEFAULT_INCLUDE = [
    '**/*.{js,json,yml}'
];
var DEFAULT_IGNORE = [
    '**/{doc,docs,example,examples,fixture,fixtures,spec,test,tests}/**/*.{js,json,yml}',
    '**/*.{spec,test}.js',
    '**/{bower,component}.json',
    '**/{gulpfile,Gruntfile}.js',
    '**/{.,}{eslint,eslintrc,jscs,jscsrc}.json',
    '**/{.,}travis.yml'
];
var DEFAULT_LOOKUPS = [
    'dependencies'
];
var NOOP = function() {};
var PATH_SEPARATOR = '/';

/**
 * Resolves dependencies file paths in a package.json.
 * @param {Object} packageJson
 * @param {Object} [options]
 * @param {String[]} [options.lookups]
 * @param {Function} [options.transformPath]
 * @param {Boolean=false} [options.sort]
 * @param {String[]} [options.include]
 * @param {String[]} [options.ignore]
 * @param {Function} [callback]
 */
module.exports = function(packageJson, options, callback) {
    if(!_.isObject(options) && !_.isFunction(callback)) {
        options = {};
        callback = NOOP;
    }
    if(_.isFunction(options)) {
        callback = options;
    }
    if(!_.isFunction(callback)) {
        callback = NOOP;
    }

    var transformPathFunction;
    if(_.isFunction(options.transformPath)) {
        transformPathFunction = options.transformPath;
    }

    var lookups = options.lookups;
    if(!lookups || _.isEmpty(lookups)) {
        lookups = DEFAULT_LOOKUPS;
    }
    resolveTree.manifest(packageJson, {lookups: lookups}, function(err, pkgsTree) {
        if(err) return callback(err);

        var pkgsFolderPaths = _.uniq(_.map(resolveTree.flatten(pkgsTree), function(pkg) {
            var pkgFolderPath = pkg.root;
            if(!transformPathFunction) return pkgFolderPath;
            return transformPathFunction(pkgFolderPath);
        }));
        if(options.sort) {
            pkgsFolderPaths = _.sortBy(pkgsFolderPaths);
        }

        var include = options.include;
        if(!include || _.isEmpty(include)) {
            include = DEFAULT_INCLUDE;
        }

        var ignore = options.ignore;
        if(!ignore || _.isEmpty(ignore)) {
            ignore = DEFAULT_IGNORE;
        }

        var globPatterns = [];
        _.forEach(pkgsFolderPaths, function(pkgPath) {
            _.forEach(include, function(includePattern) {
                globPatterns.push(pkgPath + PATH_SEPARATOR + includePattern);
            });
            _.forEach(ignore, function(ignorePattern) {
                globPatterns.push('!' + pkgPath + PATH_SEPARATOR + ignorePattern);
            });
        });
        globby(globPatterns)
            .then(function(filePaths) {
                callback(null, filePaths);
            })
            .catch(function(err) {
                callback(err);
            });
    });
};
