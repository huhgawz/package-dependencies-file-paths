'use strict';

var chai = require('chai');
var packageDependenciesFilePaths = require('../');

var MOCHA_TIMEOUT = 50000;

var cwd = process.cwd();
var expect = chai.expect;
var pkgJson = require('../package.json');

describe('package-dependencies-file-paths', function() {
    this.timeout(MOCHA_TIMEOUT);

    it('should respond dependencies file paths', function(done) {
        var options = {
            transformPath: function(folderPath) {
                return folderPath.replace(cwd + '/', '');
            },
            sort: true
        };
        packageDependenciesFilePaths(pkgJson, options, function(err, filePaths) {
            expect(err).to.not.exists;

            expect(filePaths).to.be.instanceof(Array);
            expect(filePaths).to.not.be.empty;

            done();
        });
    });
});
