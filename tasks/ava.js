'use strict';

var Api = require('ava/api.js');
var Verbose = require('ava/lib/reporters/verbose');

module.exports = function (grunt) {
	grunt.registerMultiTask('ava', 'Run AVA tests', function () {
		var cb = this.async();

		var args = this.filesSrc.concat('--color');

		var api = new Api();
		var reporter = new Verbose();
		var logs = '';

		reporter.api = api;

		api.on('test', function (test) {
			logs += '\n' + reporter.test(test);
		});

		api.on('error', function (error) {
			logs += '\n' + reporter.unhandledError(error);
		});

		api.run(args).then(function () {
			logs += '\n' + reporter.finish();

			grunt.log.write('grunt-ava:\n' + logs);

			cb();
		}).catch(function (error) {
			this.emit('error', grunt.warn(error));
			cb();
			return;
		}.bind(this));
	});
};
