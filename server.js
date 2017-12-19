// init project
var str = "abcde0fghij1klmno2pqrst3uvwxy4zABCD5EFGHI6JKLMN7OPQRS8TUVWX9YZ",  // string hash for random()
    MongoClient = require('mongodb').MongoClient,
    mongoURL = process.env.MONGOLAB_URI,
    validUrl = require('valid-url'),
    express = require('express'),
    assert = require('assert'),
    dbName = "urlDatabase",
    app = express();

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/*", function (req, res, next) {
  var url = req.params[0];
  var reg = /(sho.rt\/)\w{6,}/gi;
  // checks if url query is a valid url and isn't a shortened url
  if(!validUrl.isUri(url) && !url.match(reg)) {
    var error = {};
    error.Error = url + " doesn't appear to be a valid URL";
    res.json(error);
    return;
  }
  
  // Use connect method to connect to the Server
  MongoClient.connect(mongoURL, function(err, client) {
    assert.equal(null, err);
    console.log('Mongo connection established...');
  
    var db = client.db(dbName);
    
    // function to check, create, log, and post url queries and results.     
    function process(url) {
      // Get the urlLib collection
      var collection = db.collection('urlLib');
      var short ="sho.rt/";
        
      // checks for url in database     
      collection.find({original_url : url}).toArray(function(err, urlLib) {
        assert.equal(err, null);
        
        // no url databse results, will create and insert new object
        if (!urlLib.length) {  
          // produces a random 6 alpha-numeric string for the shortened url
          for (var i = 0; i < 6; i++) {
            short += str[Math.floor(Math.random() * str.length)];
          }
          // if the url is found in the database it is posted
          var obj = {
            original_url : url,
            shortened_url : "https://glacier-feather.glitch.me/" + short
          };
        
        // inserts the newly created short url with the queried url 
        collection.insertOne({original_url: url, shortened_url: short}, function(err, results) {
          assert.equal(err, null);
          res.json(obj);
          client.close();          
        });                  
      } else {
        // if the url queried is found in the database the results are filtered and posted
        obj = {};
        var lib = urlLib[0];
        for(var key in lib) {
          var value = lib[key];
          if(key === "original_url") {
            obj.original_url = value;
          }         
          if(key === "shortened_url") {
            obj.shortened_url = "https://glacier-feather.glitch.me/" + value;
          }
        }  
        res.json(obj);
        client.close();
      }     
    });   
  }; 
   
  // redirects if the url is shortened
  if(url.match(reg)) {
    var shortUrl = db.collection('urlLib');
    shortUrl.find({shortened_url : url}).toArray(function(err, urlLib) {
      assert.equal(err, null);
      var lib = urlLib[0];
        for(var key in lib) {
          var value = lib[key];
          if(key === "original_url") {
            res.redirect(value);
          }
        }
      client.close();
    }) 
  } else {    
    // url is passed to the function for processing
    process(url);
  }
  });  
});

// listen for requests 
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});