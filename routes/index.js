var express = require('express');
var router = express.Router();

// 1. Connect to mongoDB
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var mongoURL = 'mongodb://localhost:27017/electric';
var db;  //Global variable so all of our routes have access to the db connection

mongoClient.connect(mongoURL, function(error, database){
    if(error){
        console.log(error);
    }else{
        db = database;
        console.log('Connected to Mongo Successfully!');
    }
});

// General Steps:
// Get all the pictures into mongoDB
// Get all the pictures from the mongoDB
////////////Done via the terminal
// Get the current user from Mongo
// Find out what pictures they have voted on
// Load those picturs into an array
// Pick a random on
// Send the random one to EJS via a res.render('index', {picsArray})


/* GET home page. */
router.get('/', function(req, res, next) {
    // 2. Get pics from mongo and store them in an array to pass to view
    db.collection('images').find().toArray(function(error, photos){
    // 3. Grab a random image from that array
        var randomNum = Math.floor(Math.random() * photos.length);
        var randomPhoto = photos[randomNum].imgSrc;
    // 4. Send that image to the view
        res.render('index', { imageToRender: randomPhoto });
    });
});

router.post('/electric', function(req, res, next){
    // res.json(req.body);
    // 1. We know whether they voted electric or not becayse it's in req.body.submit
    // 2. We know what image they voted because it's in req.body.image
    // 3. We know who they are becuase we have their IP address

    db.collection('votes').insertOne({
        ip: req.ip,
        vote: req.body.submit,
        image: req.body.image
    });
    res.redirect('/');
});

module.exports = router;
