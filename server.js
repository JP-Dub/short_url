// init project
var mongodb = require('mongodb');
var express = require('express');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;
var app = express();



// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established...');
    // do some work here with the database.
    app.get("/*", function (req, res) {
      var urlLib = new Object();
      var data = new Object();
      data.obj = new Object();
      data.str = "abcde0fghij1klmno2pqrst3uvwxy4zABCD5EFGHI6JKLMN7OPQRS8TUVWX9YZ";      
        console.log(req.params, data)
      
  function mapquest(x, y) {
    
    var randomURL = function(z){
      var url = "sho.rt/";
      var str = data.str;
      for (var i = 0; i < 6; i++) {
        url += str[Math.floor(Math.random() * str.length)];
      }
  
      var isGood = mapquest(null, url);
      if (isGood) {  
        urlLib[z.toString()] = url;
        //console.log(obj.str)
      } else {
        randomURL(z);
      }   
    }
  
    for(var key in addr) {
      var val = addr[key]; 
      if(x) { //checks if  url address is in the list already
        if (key === x) {
          data.obj.original_url = key;
          data.obj.short_url = val;
          return data.obj;
        }       
      }
    
      if(y) { //checkURL
        if (y !== val) {
          var value = true;
        } else {  
          value = false;
        }
        return value;
      } 
    }
    randomURL(x);
    console.log(urlLib)
  }

  for (var i = 0; i < addrTwo.length; i++) {
    mapquest(addrTwo[i]);
  }
  console.log(data.obj)
          
  data.obj.original = "null";
  data.obj.shortened = "null";
  res.json(data.obj);
});
    //Close connection
    db.close();
  }
});


/*
app.get("/:anyurl", function (req, res) {
  console.log(req.params, "coming at you live")
  data.obj.original = "null";
  data.obj.shortened = "null";
  res.json(data.obj);
});
*/

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