// init project
var mongodb = require('mongodb');
var express = require('express');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;
var app = express();
var obj = {
  "original" : "",
  "shortened" : ""
}

// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established...');
    // do some work here with the database.
    app.get("/*", function (req, res) {
  console.log(req.params, obj)
  obj.original = "null";
  obj.shortened = "null";
  res.json(obj);
});
    //Close connection
    db.close();
  }
});

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:anyurl", function (req, res) {
  console.log(req.params, "coming at you live")
  obj.original = "null";
  obj.shortened = "null";
  res.json(obj);
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

/*
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
*/