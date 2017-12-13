// init project
var Mongo = require('mongodb').MongoClient;
var express = require('express');
var monurl = process.env.MONGOLAB_URI;
var app = express();

      var urlLib = new Object(); // this creates a db for the url library
      var data = new Object(); // creates an db for the string hash and return url query
      data.obj = new Object(); // return the results of the url query(orig_url and short_url)
      data.str = "abcde0fghij1klmno2pqrst3uvwxy4zABCD5EFGHI6JKLMN7OPQRS8TUVWX9YZ";  // string hash for random()
//var db = "mongodb://localhost:27017/urlLib";
// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Use connect method to connect to the Server
Mongo.connect(monurl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established...');  
  }
 
  app.get("/*", function (req, res) {
      var url = req.params[0];
      var short ="sho.rt/";
  // function to store and check db for url query and return results    
  function mapquest(url) {
    
    var isEmpty = function() {
      for(var key in urlLib) {
        if(urlLib.hasOwnProperty(key))
         return false;
        }
       return true;
    }
    
    var postData = function(short) {
       urlLib[url.toString()] = short; //logs query to url library
       data.obj.original_url = url;
       data.obj.shortened_url = short;
       console.log(urlLib, data.obj)
       res.json(data.obj);
    }

    // creates a random string to build the shortened url
    var randomURL = function(z){
      var str = data.str;
      for (var i = 0; i < 6; i++) {
        short += str[Math.floor(Math.random() * str.length)];
      }
     //  checks results for url match and returns the results   
     
      if(!isEmpty()) {//checks if short url address is in the db already
        for(var key in urlLib) {
          var val = urlLib[key];  
          if (short === val) {
            randomURL(z);
          }              
         }
        postData(short);
        }  
      postData(short);
    } 
     
    //checks if  original url address is in the db already
    if(!isEmpty()) {
      for(var key in urlLib) {            
        if (key === url) {
          data.obj.original_url = key;
          data.obj.shortened_url = urlLib[key];
          res.json(data.obj);
        }        
      } 
      console.log("trig 2");
      randomURL(url);
    } 
    console.log("trig 1");
    randomURL(url);
  };

mapquest(url);
});
    //Close connection
    db.close();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


/*
MongoClient.connect(db, function (err, db) {
  if (err) {
    console.log('Unable to connect to the DB server. Error:', err);
  } else {
    console.log('Connection established...'); 
  }
  db.createCollection("urlLib", function(err, res) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log("Collection created..");
    }
  });
});
*/

/*
app.get("/:anyurl", function (req, res) {
  console.log(req.params, "coming at you live")
  data.obj.original = "null";
  data.obj.shortened = "null";
  res.json(data.obj);
});
*/

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