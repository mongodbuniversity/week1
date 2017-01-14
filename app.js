var MongoClient = require('mongodb').MongoClient,
    express = require('express'),
    app = express(),
    engines = require('consolidate'),
    assert = require('assert'),
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/mongoweek1', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    // routes
    app.get('/', function (req, res) {
        res.render('movie_form');
    });

    app.post('/insertmovie', function (req, res) {
        var title = req.body.title,
            year = req.body.year,
            imdb = req.body.imdb;
        if ((title == '') || (year == '') || (imdb == '')) {
            next('Please fill out all the fields!');
        } else {
            db.collection("movies").insertOne({ 'title': title, 'year': year, 'imdb': imdb }, function(err, result) {
                assert.equal(null, err);
                res.send("Document inserted with _id: " +result.insertedId);
            });
        }
    })


    // unknown routes
    app.use(function(req, res){
        res.sendStatus(404);
    });
    // firing server
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});

