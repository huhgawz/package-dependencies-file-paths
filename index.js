'use strict';

var globby = require('globby');
var path = require('path');
var resolveTree = require('resolve-tree');

var DEFAULT_DEPENDENCIES_SETS = [
    'dependencies'
];
var NOOP = function() {};

/**
 * Resolves dependencies file paths in a package.json.
 * @param {Object} packageJson
 * @param {Object} [options]
 * @param {Boolean=false} [options.includeDotFiles]
 * @param {String[]} [options.ignore]
 * @param {String[]} [options.dependenciesSets]
 * @param {Function} [options.transformPath]
 * @param {Boolean=false} [options.sort]
 * @param {Function} [callback]
 */
module.exports = function(packageJson, options, callback) {
    if(!isObject(options) && !isFunction(callback)) {
        options = {};
        callback = NOOP;
    }
    if(isFunction(options)) {
        callback = options;
    }
    if(!isFunction(callback)) {
        callback = NOOP;
    }

    var dependenciesSets = options.dependenciesSets;
    if(!dependenciesSets || isEmpty(dependenciesSets)) {
        dependenciesSets = DEFAULT_DEPENDENCIES_SETS;
    }
    resolveTree.manifest(packageJson, {lookups: dependenciesSets}, function(err, pkgsTree) {
        if(err) return callback(err);

        var globPatterns = arrayUnique(resolveTree.flatten(pkgsTree).map(function(pkg) {
            return path.join(pkg.root, '**/*');
        }));
        if(options.ignore) {
            options.ignore.forEach(function(ignorePattern) {
                globPatterns.push('!' + ignorePattern);
            });
        }
        var includeDotFiles = options.includeDotFiles || false;
        globby(globPatterns, {dot: includeDotFiles, nodir: true})
            .then(function(filePaths) {
                var transformPathFunction = options.transformPath;
                if(isFunction(transformPathFunction)) {
                    filePaths = filePaths.map(function(filePath) {
                        return transformPathFunction(filePath);
                    });
                }

                if(options.sort) {
                    filePaths.sort();
                }

                callback(null, filePaths);
            })
            .catch(function(err) {
                callback(err);
            });
    });
};

/**
 * Checks if value is an Object.
 * @param {*} value - The value to check
 * @return {Boolean} True if value is an Object; otherwise false
 */
function isObject(value) {
    var type = typeof value;
    return !!value && (type === 'object' || type === 'function');
}

/**
 * Checks if value is a Function.
 * @param {*} value - The value to check
 * @return {Boolean} True if value is a Function; otherwise false
 */
function isFunction(value) {
    var tag = isObject(value) ? Object.prototype.toString.call(value) : '';
    return tag === '[object Function]' || tag === '[object GeneratorFunction]';
}

/**
 * Checks if array is empty.
 * @param {Array} arr - Array to check
 * @return {Boolean} True if array is empty; otherwise false
 */
function isEmpty(arr) {
    return Array.isArray(arr) && arr.length === 0;
}

/**
 * Creates an Array without duplicates.
 * @param {Array} arr
 * @return {Array}
 */
function arrayUnique(arr) {
    return Array.from(new Set(arr));
}