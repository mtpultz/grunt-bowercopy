/*
 * grunt-bowercopy
 *
 * Copyright (c) 2013 Timmy Willison
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Logging
	var log = grunt.log,
		verbose = grunt.verbose;

	// Node modules
	var fs = require('fs'),
		path = require('path');

	// Regex
	var rfolder = /\/[^\/]+$/;

	grunt.registerMultiTask(
		'bowercopy',
		'Copy only the needed files from bower components over to their specified file locations',
		function() {
			// Require an object in data
			if (!Object.keys(this.data).length) {
				log.warn('Bowercopy is not configured to copy anything');
				return;
			}

			// Options
			var options = this.options({
				srcPrefix: 'bower_components',
				destPrefix: 'js'
			});

			verbose.writeln('Using srcPrefix: ' + options.srcPrefix);
			verbose.writeln('Using destPrefix: ' + options.destPrefix);

			_.forOwn(this.data, function(dest, src) {
				// Prefix sources with the srcPath
				src = path.join(options.srcPrefix, src);
				dest = path.join(options.destPrefix, dest);

				var folder = dest.replace(rfolder, '');

				// Allow mkdir failures
				try {
					fs.mkdirSync(folder, 0755);
					verbose.writeln('Folder created: ' + folder);
				} catch( e ) {
					verbose.writeln('Folder already present: ' + folder);
				}

				// Copy
				fs.writeFileSync( dest, fs.readFileSync( src ) );
				log.writeln(src + ' -> ' + dest);
			});
			log.ok('Bower components copied to specified directories');
		}
	);
};
