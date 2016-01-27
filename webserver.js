var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var fs = require('fs');
var buttonDbWrite = require('./write_to_button_db.js');

const listenPort = 8080;

// Just here for testing.
/*
function readDb() {
  var response = db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      console.log("Entry " + currentRow.rowid + ": " + currentRow.datetime);
    })
  });
} */

// function which handles incoming HTTP requests and potentially routes/dispatches then to the right function. We should be using httpdispatcher for routing based on URL and request type (GET/POST/etc) but this is easier.
function handleRequest(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var requestUrl = request.url.toString();
  var responseBody = '';
  if (request.url.indexOf("push_button") != -1) {
    response.end("You pushed the button!");
    buttonDbWrite();
  } else {
    responseBody += "<h1>Button Presses</h1>\n";
    responseBody += fs.readFileSync('button_html.html');
    db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
      rows.forEach(function(currentRow) {
        dbResponse = "Entry " + currentRow.rowid + ": " + currentRow.datetime  + "<br />";
        responseBody += dbResponse;
      })
      response.end(responseBody + "<p>Path Hit: " + request.url + "</p>"); // had to put this within the db.all call, which is async. If it's outside db.all then response.end runs before the async db.all call can finish so parts of the response are missing. This could be improved using promises so response.end would be called after db.all.
    });
    console.log("Response sent, path \"" + request.url + "\""); // this results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, and any included script or CSS files.
  }
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(1337, '127.0.0.1'); */

// Start the web server, direct all requests to handleRequest()
http.createServer(handleRequest).listen(listenPort, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
