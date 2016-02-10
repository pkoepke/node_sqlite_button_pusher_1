'use strict';

var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var fs = require('fs');
var writeToButtonDb = require('./write_to_button_db.js');
var readFromButtonDb = require('./read_from_button_db.js');

var listenPort = 8080; // was const but const is not supported in strict mode

// function which handles incoming HTTP requests and routes/dispatches then to the right function.
//I should use  httpdispatcher for routing based on URL and request type (GET/POST/etc) but I wanted to start simple and learn about proper dispathcing later.
function handleRequest(request, response) {
  if (request.url.indexOf('favicon.ico') != -1) { // handle favicon.ico
    serveFavicon(request, response);
  } else if(request.url.indexOf('client_js.js') != -1) { // handle client_js.js
    serveClientJs(request, response);
  } else if (request.url.indexOf('styles.css') != -1) {
    serveStylesCss(request, response);
  } else if (request.url.indexOf('mobile.css') != -1){
    serveMobileCss(request, response);
  } else if (request.url.indexOf('loading_spinner.svg') != -1) { // handle /push_button/
    serveLoadingSpinnerSvg(request, response);
  } else if (request.url.indexOf('loading_spinner.gif') != -1) { // handle /push_button/
    serveLoadingSpinnerGif(request, response);
  } else if (request.url.indexOf('push_button') != -1) { // handle /push_button/
    handlePushButton(request, response);
  } else { // all other URLs get the main page with the button and entries
    serveMainPage(request, response);
  }
  // console.log('Response sent, path "' + request.url + '". ' + 'Client's IP address: ' + request.connection.remoteAddress); // For testing. This console.log results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, any included script or CSS files, etc.
}

function serveFavicon(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});-
  fs.readFile('./favicon.ico', function(err, img) {
    response.writeHead(200, {
      'Content-Type': 'image/png'
    });
    response.end(img, 'binary');
  });
}

function serveClientJs(request, response) {
  response.writeHead(200, {'Content-Type': 'application/javascript'});
  fs.readFile('./client_js.js', function (err, clientJsFile) {
    response.end(clientJsFile);
  });
}

function serveStylesCss(request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  fs.readFile('./styles.css', function (err, stylesCssFile) {
    response.end(stylesCssFile);
  });
}

function serveMobileCss(request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  fs.readFile('./mobile.css', function (err, mobileCssFile) {
    response.end(mobileCssFile);
  });
}

function serveLoadingSpinnerSvg(request, response) {
  response.writeHead(200, {'Content-Type': 'image/svg+xml', 'Vary': 'Accept-Encoding'});
  fs.readFile('./loading_spinner.svg', function (err, loadingSpinner) {
    response.end(loadingSpinner);
  });
}

function serveLoadingSpinnerGif(request, response) {
  response.writeHead(200, {'Content-Type': 'image/gif'});
  fs.readFile('./loading_spinner.gif', function (err, loadingSpinner) {
    response.end(loadingSpinner);
  });
}

function handlePushButton(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  writeToButtonDb(request.connection.remoteAddress, function() {
    var responseBody = '';
    responseBody += '<p id="lastPathAccessed">Last path accessed: ' + request.url + '</p>\n<p id="clientIpAddress">Current client\'s IP address: ' + request.connection.remoteAddress + '</p>\n';
    readFromButtonDb(responseBody, function(responseBodyReturn) {
      response.end(responseBodyReturn);
    });
  });
}

function serveMainPage(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html', 'Content-Language': 'en'});
  var requestUrl = request.url.toString();
  var responseBody = '';
  fs.readFile('./mainpage_html.html', function(err, data) {
    responseBody += data;
    responseBody += '<p id="lastPathAccessed">Last path accessed: ' + request.url + '</p>\n<p id="clientIpAddress">Current client\'s IP address: ' + request.connection.remoteAddress + '</p>\n';
    // Finish the response by gathering all the button clicks
    readFromButtonDb(responseBody, function(responseBodyReturn) {
      // console.log('readFromButtonDb callback ran. responseBodyReturn: ' + responseBodyReturn); // for testing
      responseBodyReturn += '</div>\n</body>\n</html>'
      response.end(responseBodyReturn);
    });
  });
}

// Start the web server, direct all requests to handleRequest()
http.createServer(handleRequest).listen(listenPort);
console.log('Server running on port ' + listenPort);
