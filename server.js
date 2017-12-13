// init project
var Mongo = require('mongodb').MongoClient;
var express = require('express');
var monurl = process.env.MONGOLAB_URI;
var app = express();

      var urlLib = new Object(); // this creates a db for the url library
      var data = new Object(); // creates an db for the string hash and return url query
      //data.obj = new Object(); // return the results of the url query(orig_url and short_url)
      data.str = "abcde0fghij1klmno2pqrst3uvwxy4zABCD5EFGHI6JKLMN7OPQRS8TUVWX9YZ";  // string hash for random()
//var db = "mongodb://localhost:27017/urlLib";
// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
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

// Use connect method to connect to the Server
Mongo.connect(monurl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established...');  
  }

  
  app.get("/*", function (req, res) {
      var url = req.params[0];

  // function to store and check db for url query and return results    
  function mapquest(x, y) {
    data.obj = new Object();
    // creates a random string to build the shortened url
    var randomURL = function(z){
      var short = "sho.rt/",
            str = data.str;
      for (var i = 0; i < 6; i++) {
        short += str[Math.floor(Math.random() * str.length)];
      }
      
      //  checks results for url match and returns the results   
      var isGood = mapquest(null, short);
      
      if (isGood) {  
        urlLib[z.toString()] = short; //logs query to url library
        data.obj.original_url = z;
        data.obj.shortened_url = short;
        res.json(data.obj);
      } else {
        randomURL(z); // if random() duplicates, a new random() hash string is created
      }   
    }
  
    var isEmpty = function() {
      for(var key in urlLib) {
        if(urlLib.hasOwnProperty(key))
            return false;
        }
      return true;
    }
        
    if(x) { //checks if  original url address is in the db already
      if(!isEmpty()) {
        for(var key in urlLib) {
          var val = urlLib[key];           
          if (key === x) { 
            
            data.obj.original_url = key;
            data.obj.short_url = val;
            console.log(urlLib);
            res.json(data.obj);
          }       
        }
      }
      randomURL(x);
    }
    
    if(y) {
      if(!isEmpty()) {//checks if short url address is in the db already
      for(var key in urlLib) {
        var val = urlLib[key];  
         if (y !== val) {
          var value = true;
        } else {  
          value = false;
        }
        return value;
        }
      }
      return true;
    }      
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