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

    it('should resolve package.json dependencies file paths', function(done) {
        var options = {
            ignore: [
                '**/{doc,docs,example,examples,fixture,fixtures,spec,test,tests}/**',
                '**/{.,}{eslintrc,jscsrc}{.json,}',
                '**/.{editorconfig,gitattributes,gitignore,npmignore}',
                '**/.travis.yml',
                '**/{bower,component}.json',
                '**/{gulpfile,Gruntfile}.js',
                '**/{LICENSE,License,license}',
                '**/*.{spec,test}.js',
                '**/*.{markdown,md}'
            ],
            transformPath: function(folderPath) {
                return folderPath.replace(cwd + path.sep, '');
            },
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
                expect(filePath).to.not.match(/\.(editorconfig|gitattributes)/i);
                expect(filePath).to.not.match(/\.(git|npm)ignore/i);
                expect(filePath).to.not.match(/\.?(eslint|jscs)rc\.json$/i);
                expect(filePath).to.not.match(/\.travis\.yml$/i);

                // Validate Markdown files have been ignored
                expect(filePath).to.not.match(/\.(markdown|md)$/i);

                // Validate spec and test files have been ignored
                expect(filePath).to.not.match(/\.(spec|test)\.js$/i);

                // Validate bower.json, component.json, Gruntfile.js and gulpfile.json files have been ignored
                expect(filePath).to.not.match(/(bower|component)\.json$/i);
                expect(filePath).to.not.match(/(Gruntfile|gulpfile)\.js$/i);

                // Validate license files have been ignored
                expect(filePath).to.not.match(/license$/i);
            });

            // Validate package.json dependencies paths are included in file paths
            _.forEach(_.keys(pkgJson.dependencies), function(dependency) {
                var dependencyPackageJsonFilePath = path.join('node_modules', dependency, 'package.json');
                expect(filePaths).to.include(dependencyPackageJsonFilePath);
            });

            done();
        });
    });
});
