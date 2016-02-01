"use strict";

var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var fs = require('fs');
var buttonDbWrite = require('./write_to_button_db.js');

var listenPort = 8080; // was const but const is not supported in strict mode

// function which handles incoming HTTP requests and potentially routes/dispatches then to the right function. We should be using httpdispatcher for routing based on URL and request type (GET/POST/etc) but this is easier.
function handleRequest(request, response) {
  if (request.url.indexOf("favicon.ico") != -1) { // handle favicon.ico
    serveFavicon(request, response);
  } else if(request.url.indexOf("client_js.js") != -1) { // handle client_js.js
    serveButtonClientJs(request, response);
  } else if (request.url.indexOf("push_button") != -1) { // handle /push_button/
    handlePushButton(request, response);
  } else { // all other URLs get the main page with the button and entries
    serveMainPage(request, response);
  }
  console.log("Response sent, path '" + request.url + "'. " + "Client's IP address: " + request.connection.remoteAddress); // this results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, and any included script or CSS files.
}

function serveFavicon(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});-
  fs.readFile('./favicon.ico', function(err, img) {
    response.writeHead(200, {
      'Content-Type': 'image/gif'
    });
    response.end(img, 'binary');
  });
}

function serveButtonClientJs(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('./client_js.js', function (err, clientJsFile) {
    response.end(clientJsFile);
  });
}

function returnAllDbEntries(rows) {
  var returnRows = "";
  rows.forEach(function(currentRow) {
    returnRows += "Entry " + currentRow.rowid + ": <span class=\"buttonPushTime\">" + currentRow.datetime + "</span> | Client IP address: " + currentRow.clientIp + "<br />\n";
  });
  return returnRows;
}

function handlePushButton(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  buttonDbWrite(request.connection.remoteAddress);
  var responseBody = "";
  db.all("SELECT ROWID, datetime, clientIp from button_info", function(err,rows) {
    responseBody += returnAllDbEntries(rows);
    response.end(responseBody); // had to put this within the db.all call, which is async. If it's outside db.all then response.end runs before the async db.all call can finish so parts of the response are missing. This could be improved using promises so response.end would be called after db.all.
  });
}

function serveMainPage(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var requestUrl = request.url.toString();
  var responseBody = "";
  // responseBody += fs.readFileSync('material_design_CSS_scripts_links.html') // adds Material Design CSS and JavaScript from Google.
  responseBody += "<h1>Button Presses</h1>\n";
  responseBody += fs.readFileSync('button_html.html');
  responseBody += "<p>Current path: " + request.url + "</p>\n<p>Current client's IP address: " + request.connection.remoteAddress + "</p>\n";
  responseBody += "<div id=\"buttonPushes\">\n"
  // Finish the response by gathering all the button clicks
  /*db.all("SELECT ROWID, datetime, clientIp from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      responseBody += "Entry " + currentRow.rowid + ": <span class=\"buttonPushTime\">" + currentRow.datetime + "</span> | Client IP address: " + currentRow.clientIp + "<br />\n";
    });
    responseBody += "</div>"
    responseBody += "<script src='client_js.js'></script>"
    response.end(responseBody); // had to put this within the db.all call, which is async. If it's outside db.all then response.end runs before the async db.all call can finish so parts of the response are missing. This could be improved using promises so response.end would be called after db.all.
  });*/
  db.all("SELECT ROWID, datetime, clientIp from button_info", function(err,rows) {
    responseBody += returnAllDbEntries(rows);
    responseBody += "</div>\n"
    responseBody += "<script src='client_js.js'></script>\n"
    response.end(responseBody); // had to put this within the db.all call, which is async. If it's outside db.all then response.end runs before the async db.all call can finish so parts of the response are missing. This could be improved using promises so response.end would be called after db.all.
  });
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(listenPort); */

// Start the web server, direct all requests to handleRequest()
http.createServer(handleRequest).listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');
