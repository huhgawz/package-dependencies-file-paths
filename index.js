'use strict';

var _ = require('lodash');
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
 * @param {String[]} [options.ignore]
 * @param {String[]} [options.dependenciesSets]
 * @param {Function} [options.transformPath]
 * @param {Boolean=false} [options.sort]
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

    var dependenciesSets = options.dependenciesSets;
    if(!dependenciesSets || _.isEmpty(dependenciesSets)) {
        dependenciesSets = DEFAULT_DEPENDENCIES_SETS;
    }
    resolveTree.manifest(packageJson, {lookups: dependenciesSets}, function(err, pkgsTree) {
        if(err) return callback(err);

        var globPatterns = _.uniq(_.map(resolveTree.flatten(pkgsTree), function(pkg) {
            return path.join(pkg.root, '**/*');
        }));
        _.forEach(options.ignore, function(ignorePattern) {
            globPatterns.push('!' + ignorePattern);
        });
        globby(globPatterns, {dot: true, nodir: true})
            .then(function(filePaths) {
                var transformPathFunction = options.transformPath;
                if(_.isFunction(transformPathFunction)) {
                    filePaths = _.map(filePaths, function(filePath) {
                        return transformPathFunction(filePath);
                    });
                }

                if(options.sort) {
                    filePaths = _.sortBy(filePaths);
                }

                callback(null, filePaths);
            })
            .catch(function(err) {
                callback(err);
            });
    });
};