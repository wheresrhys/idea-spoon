'use strict';

require('es6-promise').polyfill();

var express = require('express');
var mongoose = require('mongoose');
var random = require('mongoose-random');
var hbs = require('handlebars');
var ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('DB connection open');
});

var ideaSchema = mongoose.Schema({
	note: String,
	votes: {type: Number, 'default': 0},
	isFull: Boolean,
	lookUp: Boolean,
	isDone: Boolean
});

ideaSchema.plugin(random); // by default `path` is `random`. It's used internally to store a random value on each doc.


var Idea = mongoose.model('notebook', ideaSchema);


// if you have an existing collection, it must first by synced.
// this will add random data for the `path` key for each doc.

function getFive () {
	return Idea.findRandom().limit(10).exec()
		.then(function (ideas) {
		  return ideas
		 		.filter(function (i) {
					return !i.isDone && !i.lookUp && !i.isFull;
				})
			  .sort(function (i1, i2) {
			  	return i1.downVotes == i2.downVotes ? 0 : i1.downVotes > i2.downVotes ? -1 : 1;
			  })
			  .slice(0, 5).map(function (idea) {
			  	idea = idea.toObject();
			  	idea.note = idea.note.replace(/\n/g, '<br>');
			  	return idea;
			  });
		});
}

var app = express();

var tpl = hbs.compile(require('fs').readFileSync(__dirname + '/index.html', 'utf8'));

app.use(express.static(__dirname + '/public'))

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
	getFive()
		.then(function (ideas) {
			res.send(tpl({
				ideas: ideas
			}));
		}, function (err) {
			console.log(err);
			res.send(err);
		});
});

app.put('/:id', function (req, res) {
	Idea.update({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).exec()
		.then(function () {
			return Idea.findOne({
				_id: new ObjectId(req.params.id)
			}).exec()
				.then(function (idea) {
					res.send(idea);
				});
		})
		.then(function () {}, function (err) {
			res.setStatus(503).send(err);
		});

});

// app.get('/add', function (req, res) {

// });

// app.post('/add', function (req, res) {

// });

var port = process.env.PORT || 3000;


app.listen(port, function () {
	console.log('idea spoon has stirred on ' + port);
});
