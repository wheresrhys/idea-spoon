'use strict';

require('es6-promise').polyfill();

var express = require('express');
var mongoose = require('mongoose');
var random = require('mongoose-random');

mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('DB connection open');
});

var ideaSchema = mongoose.Schema({
	note: String
});

ideaSchema.plugin(random); // by default `path` is `random`. It's used internally to store a random value on each doc.


var Idea = mongoose.model('notebook', ideaSchema);


// if you have an existing collection, it must first by synced.
// this will add random data for the `path` key for each doc.



var app = express();

app.get('/', function (req, res) {
	// Idea.syncRandom(function (err, result) {
	//   console.log(result.updated);
	//   res.send(500);
	// });
	Idea.findRandom().limit(5).exec().then(function (ideas) {
	  res.json(ideas);
	});
});

app.get('/add', function (req, res) {

});

var port = process.env.PORT || 3000;


app.listen(port, function () {
	console.log('idea spoon has stirred on ' + port);
});
