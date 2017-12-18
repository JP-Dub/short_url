// init project
var MongoClient = require('mongodb').MongoClient;
var mongoURL = process.env.MONGOLAB_URI;
var validUrl = require('valid-url');
var express = require('express');
var app = express();
var dbName = "urlDatabase";

var   urlLib = new Object(), // this creates a db to store query session
      data = new Object(); // creates an db for the string hash (data.str) and return url query in the data.obj
      data.obj = new Object(); // store the results of the url query(orig_url and short_url)
      data.str = "abcde0fghij1klmno2pqrst3uvwxy4zABCD5EFGHI6JKLMN7OPQRS8TUVWX9YZ";  // string hash for random()

var assert = require('assert');

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/*", function (req, res, next) {
  var url = req.params[0];
    
    // checks if url query is a valid url
  if(!validUrl.isUri(url)) {
    var error = {};
    error.Error = url + " doesn't appear to be a valid URL";
    res.json(error);
    return;
  }
      
  // function to check, create, log, and post url queries and results.     
  function mapquest(url) {
      
    // checks if urlLib is empty
    var isEmpty = function() {
      for(var key in urlLib) {
        if(urlLib.hasOwnProperty(key)) 
          return false;
        } 
      return true;
    }
    // posts result to the screen
    var postData = function(log, url, short) {
      if(log) {
        urlLib[url] = short; //logs query to url library(urlLib)
      }
       data.obj.original_url = url;
       data.obj.shortened_url = short;
       res.json(data.obj);
    }

   // creates a random string to build the shortened url
    var randomURL = function(z){
      var short ="sho.rt/", str = data.str;
      for (var i = 0; i < 6; i++) {
        short += str[Math.floor(Math.random() * str.length)];
      }
        
      //checks if short url address is in the db already
      if(!isEmpty()) {
        for(var key in urlLib) {
          var val = urlLib[key];  
          if (short === val) {
            randomURL(z); // duplicate short url is found in the urlLib, creates a new string
            return;
          }              
        }        
        postData(true, z, short); // if no duplicates are found in the urlLib, post data
        } else { 
          postData(true, z, short); // if urlLib is empty, post data
        }
    } 
      
    //checks if  original url address is in the db already
    if(!isEmpty()) {
      for(var key in urlLib) {            
        if (key === url) {
         postData(false, url, urlLib[key]); // if duplicate url query is found in the urlLib, return the results
         return;
        }      
      }
      randomURL(url); // no duplicates are found      
    } else {
      randomURL(url); // the urlLib is empty
    }
  };

mapquest(url);
    
});



var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
   
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
// Use connect method to connect to the Server
MongoClient.connect(mongoURL, function(err, client) {
 // if (err) {
 //   console.log('Unable to connect to the mongoDB server. Error:', err);
 // } else {
 //   console.log('Mongo connection established...');  
 // }
assert.equal(null, err);
  console.log("connect successfully to the server")
  
  var db = client.db(dbName);
  

 insertDocuments(db, function() {
     //Close connection
  client.close();
   });  
  //db.createCollection("urlLib");
  //var lib = db.collection("urlLib");


  
  
});

// experimental code - to be modified
app.get("/https://www.yahoo.com", function (req, res, next) {
  res.redirect("https://www.yahoo.com")
  console.log(req.url, "found it!")
  
});

// listen for requests 
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//mongod --port 27017 --bind_ip=$IP --dbpath=./data --rest "$@"


/*

  db.createCollection("urlLib", function(err, res) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log("Collection created..");
    }
  });

*/


/*
app.use('/public', express.static(process.cwd() + '/public'));

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

*/