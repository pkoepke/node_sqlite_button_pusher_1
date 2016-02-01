"use strict";

var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var fs = require('fs');
var writeToButtonDb = require('./write_to_button_db.js');
var readFromButtonDb = require('./read_from_button_db.js');

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
  // console.log("Response sent, path '" + request.url + "'. " + "Client's IP address: " + request.connection.remoteAddress); // For testing. This results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, and any included script or CSS files.
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

function handlePushButton(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  writeToButtonDb(request.connection.remoteAddress, function() {
    console.log("writeToButtonDb() finished and moved on to its callback")
    var responseBody = "";
    /*setTimeout(*/readFromButtonDb(responseBody,
      function(responseBodyReturn) {
        console.log("readFromButtonDb() finished and moved on to its callback");
        response.end(responseBodyReturn);
      })/*, 5000)*/
  });
}

function serveMainPage(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var requestUrl = request.url.toString();
  var responseBody = "";
  // responseBody += fs.readFileSync('material_design_CSS_scripts_links.html') // adds Material Design CSS and JavaScript from Google.
  responseBody += "<h1>Button Presses</h1>\n";
  responseBody += "<p><input type=\"button\" value=\"Push the button!\" onclick=\"httpGetAsync('push_button',overWriteButtonPushesDiv)\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" /></p>\n";
  responseBody += "<p>Current path: " + request.url + "</p>\n<p>Current client's IP address: " + request.connection.remoteAddress + "</p>\n";
  responseBody += "<div id=\"buttonPushes\">\n"
  // Finish the response by gathering all the button clicks
  readFromButtonDb(responseBody, function(responseBodyReturn) {
    // console.log("readFromButtonDb callback ran. responseBodyReturn: " + responseBodyReturn); // for testing
    responseBodyReturn += "</div>\n"
    responseBodyReturn += "<script src='client_js.js'></script>\n"
    response.end(responseBodyReturn);
  });
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(listenPort); */

// Start the web server, direct all requests to handleRequest()
http.createServer(handleRequest).listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');
