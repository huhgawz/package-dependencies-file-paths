'use strict';

var _ = require('lodash');
var chai = require('chai');
var packageDependenciesFilePaths = require('../');
var path = require('path');

var MOCHA_TIMEOUT = 50000;

var cwd = process.cwd();
var expect = chai.expect;
var pkgJson = require('../package.json');

describe('package-dependencies-file-paths', function() {
    this.timeout(MOCHA_TIMEOUT);

    function validateDependenciesPaths(filePaths, pkgJson) {
        _.forEach(_.keys(pkgJson.dependencies), function(dependency) {
            var dependencyPackageJsonFilePath = path.join('node_modules', dependency, 'package.json');
            expect(filePaths).to.include(dependencyPackageJsonFilePath);
        });
    }

    function transformFilePath(filePath) {
        return filePath.replace(cwd + path.sep, '');
    }

    it('should resolve package.json dependencies file paths', function(done) {
        var options = {
            includeDotFiles: true,
            ignore: [
                '**/{doc,docs,example,examples,fixture,fixtures,spec,test,tests}/**',
                '**/{.,}{eslint,jscs,jshint}rc{.json,}',
                '**/.{editorconfig,gitattributes,gitmodules}',
                '**/.{eslint,git,npm}ignore',
                '**/.travis.yml',
                '**/{bower,component}.json',
                '**/{gulpfile,Gruntfile}.js',
                '**/{LICENCE,LICENSE,License,license}',
                '**/*.{spec,test}.js',
                '**/*.{markdown,md,ts}'
            ],
            transformPath: transformFilePath,
            sort: true
        };
        packageDependenciesFilePaths(pkgJson, options, function(err, filePaths) {
            expect(err).to.not.exists;

            // Validate file paths Array is not empty
            expect(filePaths).to.be.instanceof(Array);
            expect(filePaths).to.not.be.empty;

            _.forEach(filePaths, function(filePath) {
                // Validate documentation, example, fixtures, spec and test folders have been ignored
                expect(filePath).to.not.match(/.+\/(doc|example|fixture|spec|test)s?\/.+\.(js|json|yml)$/i);

                // Validate dot files have been ignored
                expect(filePath).to.not.match(/\.(editorconfig|gitattributes|gitmodules)/i);
                expect(filePath).to.not.match(/\.(eslint|git|npm)ignore/i);
                expect(filePath).to.not.match(/\.?(eslint|jscs|jshint)rc\.json$/i);
                expect(filePath).to.not.match(/\.travis\.yml$/i);

                // Validate Markdown and Typescript files have been ignored
                expect(filePath).to.not.match(/\.(markdown|md|ts)$/i);

                // Validate spec and test files have been ignored
                expect(filePath).to.not.match(/\.(spec|test)\.js$/i);

                // Validate bower.json, component.json, Gruntfile.js and gulpfile.json files have been ignored
                expect(filePath).to.not.match(/(bower|component)\.json$/i);
                expect(filePath).to.not.match(/(Gruntfile|gulpfile)\.js$/i);

                // Validate license files have been ignored
                expect(filePath).to.not.match(/licen(c|s)e$/i);
            });

            // Validate package.json dependencies paths are included in file paths
            validateDependenciesPaths(filePaths, pkgJson);

            done();
        });
    });

    it('should resolve package.json dependencies file paths without including dot files', function(done) {
        var options = {
            transformPath: transformFilePath
        };
        packageDependenciesFilePaths(pkgJson, options, function(err, filePaths) {
            expect(err).to.not.exists;

            // Validate file paths Array is not empty
            expect(filePaths).to.be.instanceof(Array);
            expect(filePaths).to.not.be.empty;

            _.forEach(filePaths, function(filePath) {
                // Validate dot files have been ignored
                expect(filePath).to.not.match(/\.(editorconfig|gitattributes|gitmodules)/i);
                expect(filePath).to.not.match(/\.(eslint|git|npm)ignore/i);
                expect(filePath).to.not.match(/\.?(eslint|jscs|jshint)rc\.json$/i);
                expect(filePath).to.not.match(/\.travis\.yml$/i);
            });

            // Validate package.json dependencies paths are included in file paths
            validateDependenciesPaths(filePaths, pkgJson);

            done();
        });
    });
});
