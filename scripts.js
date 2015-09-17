'use strict';

require('es6-promise').polyfill();

var program = require('commander');
var denodeify = require('denodeify');
var exec = denodeify(require('child_process').exec, function(err, stdout, stderr) { return [err, stdout]; });
var fs = require('fs');
var path = require('path');
var util = require('util');

var backup = function () {
	return exec(util.format(
		'mongodump -h %s -d %s -u %s -p %s -o ~/Dropbox/idea-backups/%s',
		process.env.MONGO_HOST, process.env.MONGO_DB, process.env.MONGO_USER, process.env.MONGO_PASSWORD, new Date().toISOString().replace(/\//g, '-')
	)).catch(exit);
};

function exit(err) {
	console.log(err);
	process.exit(1);
}

program
	.command('update [file]')
	.action(function(file) {
		file = file || process.env.FILE;
		var filePath;
		Promise.all([
			// backup(),
			Promise.resolve(),
			Promise.all([
				exec('rm -Rf tmp').then(function () {return exec('mkdir tmp');}),
				denodeify(fs.readFile)(file, 'utf8').then(function (notes) {
					var exists = {};
					notes = notes
						.replace(/Subject\:.*(\r?\n)/g, '')
						.replace(/From\: Rhys Evans.*(\r?\n)/g, '')
						.replace(/Date\: \d\d\/\d\d\/\d\d\d\d.*(\r?\n)/g, '')
						.replace(/(\r?\n)+-+(\r?\n)+/gm, '^^^^')
						.replace(/(\r?\n)/g, '\\n')
						.replace(/"/g, '\\"')
						.split('^^^^')
						.filter(function (note) {
							if (!note || exists[note]) {
								return false;
							}
							exists[note] = true
							return true;
						})
						.map(function (note) {
							return '{"note":"' + note.replace(/(^(\\n)+|(\\n)+$)/, '') + '"}';
						});

					var noteBunches = [];

					while(notes.length) {
						noteBunches.push(notes.splice(0, 100));
					}
					return noteBunches;
				})
			]).then(function (res) {
				return Promise.all(res[1].map(function (bunch, index) {
					var filePath = path.join(process.cwd(), 'tmp', index + '.json');
					return denodeify(fs.writeFile)(filePath, bunch.join('\n'))
						.then(function () {
							return filePath;
						});
				}));
			})
		]).then(function (res) {

			return Promise.all(res[1].map(function (path) {
				console.log('uploading ' + path);
				// console.log(util.format(
				// 	'mongoimport -h %s -d %s -c notebooks -u %s -p %s --file %s',
				// 	process.env.MONGO_HOST, process.env.MONGO_DB, process.env.MONGO_USER, process.env.MONGO_PASSWORD, path
				// ))

				return exec(util.format(
					'mongoimport -h %s -d %s -c notebooks -u %s -p %s --file %s',
					process.env.MONGO_HOST, process.env.MONGO_DB, process.env.MONGO_USER, process.env.MONGO_PASSWORD, path
				))
				.then(function (path) {
					console.log('uploaded ' + path);
				});
			}))

		}).catch(exit);
	});

program
	.command('backup')
	.action(backup);

program
	.command('restore')
	.action(function () {

		return exec(util.format(
			'mongorestore -h %s -d %s -u %s -p %s ~/Dropbox/idea-backups/%s',
			process.env.MONGO_HOST, process.env.MONGO_DB, process.env.MONGO_USER, process.env.MONGO_PASSWORD, process.env.FILE
		)).catch(exit);

	});

program.parse(process.argv);
