var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var fs = require('fs');

function readDb() {
  var response = db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      console.log("Entry " + currentRow.rowid + ": " + currentRow.datetime);
    })
  });
}

function handleRequest(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var responseBody = '';
  responseBody += "<h1>Button Presses</h1>\n";
  responseBody += fs.readFileSync('button_html.html');
  db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      dbResponse = "Entry " + currentRow.rowid + ": " + currentRow.datetime  + "<br />";
      responseBody += dbResponse;
    })
    response.end(responseBody);
    console.log("Response sent.")
  });
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(1337, '127.0.0.1'); */

http.createServer(handleRequest).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

readDb();
