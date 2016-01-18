var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');

function readDb() {
  var response = db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      console.log("Entry " + currentRow.rowid + ": " + currentRow.datetime);
    })
  });
}

function handleRequest(request, response) {
  readDb();
  response.writeHead(200, {'Content-Type': 'text/plain'});
  var responseBody = "";
  responseBody += "<html>";
  responseBody += "<body>";
  responseBody += "<h1>Button Presses</h1>";
  responseBody += 
  responseBody += "</body>";
  responseBody += "</html>";
  response.end(responseBody);
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(1337, '127.0.0.1'); */

http.createServer(handleRequest).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

readDb();
