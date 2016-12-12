'use strict';

var _ = require('lodash');
var chai = require('chai');
var packageDependenciesFilePaths = require('../');

var MOCHA_TIMEOUT = 50000;
var PATH_SEPARATOR = '/';

var cwd = process.cwd();
var expect = chai.expect;
var pkgJson = require('../package.json');

describe('package-dependencies-file-paths', function() {
    this.timeout(MOCHA_TIMEOUT);

    it('should resolve package.json dependencies file paths', function(done) {
        var options = {
            transformPath: function(folderPath) {
                return folderPath.replace(cwd + PATH_SEPARATOR, '');
            },
            sort: true
        };
        packageDependenciesFilePaths(pkgJson, options, function(err, filePaths) {
            expect(err).to.not.exists;

            // Validate file paths Array is not empty
            expect(filePaths).to.be.instanceof(Array);
            expect(filePaths).to.not.be.empty;

            _.forEach(filePaths, function(filePath) {
                // Validate cwd is not part of file paths
                expect(filePath).to.not.include(cwd);

                // Validate Markdown and Text files have been ignored
                expect(filePath).to.not.match(/\.(md|txt)$/i);

                // Validate documentation, example, fixtures and test paths have been ignored
                expect(filePath).to.not.match(/.+\/(doc|example|fixture|test)s?\/.+\.(js|json|yml)$/i);

                // Validate some dot files have been ignored
                expect(filePath).to.not.match(/\.?(eslint|jscs)(rc)?\.json$/i);
                expect(filePath).to.not.match(/\.?travis\.yml$/i);

                // Validate test files have been ignored
                expect(filePath).to.not.match(/\.(spec|test)\.js$/i);

                // Validate bower.json, component.json, Gruntfile.js and gulpfile.json files have been ignored
                expect(filePath).to.not.match(/(bower|component)\.json$/i);
                expect(filePath).to.not.match(/(Gruntfile|gulpfile)\.js$/i);
            });

            // Validate package.json dependencies paths are included in file paths
            _.forEach(_.keys(pkgJson.dependencies), function(dependency) {
                var dependencyPackageJsonFilePath = ['node_modules', dependency, 'package.json'].join(PATH_SEPARATOR);
                expect(filePaths).to.include(dependencyPackageJsonFilePath);
            });

            done();
        });
    });
});
