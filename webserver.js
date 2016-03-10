'use strict';

// requires, new sqlite DB, and setting TCP port tolisten on.
var http = require('http');
var fs = require('fs');
var writeToButtonDb = require('./write_to_button_db.js');
var readFromButtonDb = require('./read_from_button_db.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');
var listenPort = 8080; // was const but const is not supported in strict mode

// create variables to hold cached data from static files and database. Files are read sync instead of async because the web server should load these files immediately and cache their contents before doing anything else, including staring the web server. Doing these as async and either starting the web server right away, or starting the web server as a callback to these asymc calls, is pointless - the web sever can't do anything until these are read so just do them sync at startup.
// DB contents will be read in cacheDbResponseHtml().
var faviconFile = fs.readFileSync('./favicon.ico');
var clientJsFile = fs.readFileSync('./client_js.js');
var stylesCssFile = fs.readFileSync('./styles.css');
var mobileCssFile = fs.readFileSync('./mobile.css');
var loadingSpinnerGifFile = fs.readFileSync('./loading_spinner.gif');
var mainPageHtmlString = fs.readFileSync('./mainpage_html.html', 'utf8');
var everythingAfterButtonDivCache = "";

// function which handles incoming HTTP requests and routes/dispatches then to the right function.
//I should use  httpdispatcher for routing based on URL and request type (GET/POST/etc) but I wanted to start simple and learn about proper dispathcing later.
function handleRequest(request, response) {
  if (request.url.indexOf('favicon.ico') != -1) { // serve favicon.ico
    serveFavicon(request, response);
  } else if(request.url.indexOf('client_js.js') != -1) { // serve client_js.js
    serveClientJs(request, response);
  } else if (request.url.indexOf('styles.css') != -1) { // serve styles.css
    serveStylesCss(request, response);
  } else if (request.url.indexOf('mobile.css') != -1){ // serve mobile.css
    serveMobileCss(request, response);
  } else if (request.url.indexOf('loading_spinner.svg') != -1) { // serve spinner animation svg
    serveLoadingSpinnerSvg(request, response);
  } else if (request.url.indexOf('loading_spinner.gif') != -1) { // serve spinner animation gifs
    serveLoadingSpinnerGif(request, response);
  } else if (request.url.indexOf('push_button') != -1) { // handle /push_button/ by writing to DB then returning an updated entry list.
    handlePushButton(request, response);
  } else if (request.url.indexOf('current_entries') != -1) { // serve the current list of entries, but do not write to the DB.
    serveCurrentEntries(request, response);
  } else { // all other URLs get the main page with the button and entries
    serveMainPage(request, response);
  }
  // console.log('Response sent, path "' + request.url + '". ' + 'Client's IP address: ' + request.connection.remoteAddress); // For testing. This console.log results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, any included script or CSS files, etc.
}

function serveFavicon(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  /*fs.readFile('./favicon.ico', function(err, img) {
    response.writeHead(200, {'Content-Type': 'image/png'});
    response.end(img, 'binary');
  });*/
  response.writeHead(200, {'Content-Type': 'image/png'});
  response.end(faviconFile, 'binary');
}

function serveClientJs(request, response) {
  response.writeHead(200, {'Content-Type': 'application/javascript'});
  /*fs.readFile('./client_js.js', function (err, clientJsFile) {response.end(clientJsFile)});*/
  response.end(clientJsFile);
}

function serveStylesCss(request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  /*fs.readFile('./styles.css', function (err, stylesCssFile) {
    response.end(stylesCssFile);
  });*/
  response.end(stylesCssFile);
}

function serveMobileCss(request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  /*fs.readFile('./mobile.css', function (err, mobileCssFile) {
    response.end(mobileCssFile);
  });*/
  response.end(mobileCssFile);
}

function serveLoadingSpinnerSvg(request, response) {
  response.writeHead(200, {'Content-Type': 'image/svg+xml', 'Vary': 'Accept-Encoding'});
  fs.readFile('./loading_spinner.svg', function (err, loadingSpinner) {
    response.end(loadingSpinner);
  });
}

function serveLoadingSpinnerGif(request, response) {
  response.writeHead(200, {'Content-Type': 'image/gif'});
  /*fs.readFile('./loading_spinner.gif', function (err, loadingSpinner) {
    response.end(loadingSpinner);
  });*/
  response.end(loadingSpinnerGifFile);
}

// Writes the button push to the DB, then calls serveCurrentEntries() to respond with just the DIV.
function handlePushButton(request, response) {
  var responseBody = '';
  var responseBodyReturn = '';
  writeToButtonDb(request.connection.remoteAddress, function() {
    cacheDbResponseHtml(function() { serveCurrentEntries(request, response); });
    everythingAfterButtonDivCache ='<p id="lastPathAccessed">Last path accessed: ' + request.url + '</p>\n<p id="clientIpAddress">Current client\'s IP address: ' + request.connection.remoteAddress + '</p>\n' + everythingAfterButtonDivCache;
  });
}

function serveCurrentEntries(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
  /*var responseBody = '';
  var responseBodyReturn = '';
  readFromButtonDb(responseBody, function(responseBodyReturn) {
    response.end(responseBodyReturn);
  });*/
  response.end(everythingAfterButtonDivCache);
}

function serveMainPage(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html', 'Content-Language': 'en'});
  var requestUrl = request.url.toString();
  var responseBody = '';
  var responseBodyReturn = '';
  /*fs.readFile('./mainpage_html.html', function(err, data) {
    responseBody += data;
    responseBody += '<p id="lastPathAccessed">Last path accessed: ' + request.url + '</p>\n<p id="clientIpAddress">Current client\'s IP address: ' + request.connection.remoteAddress + '</p>\n';
    // Finish the response by gathering all the button clicks
    readFromButtonDb(responseBody, function(responseBodyReturn) {
      // console.log('readFromButtonDb callback ran. responseBodyReturn: ' + responseBodyReturn); // for testing
      responseBodyReturn += '</div>\n</body>\n</html>'
      response.end(responseBodyReturn);
    });
  });*/
  responseBody += mainPageHtmlString;
  responseBody += '<p id="lastPathAccessed">Last path accessed: ' + request.url + '</p>\n<p id="clientIpAddress">Current client\'s IP address: ' + request.connection.remoteAddress + '</p>\n';
  responseBody += everythingAfterButtonDivCache;
  response.end(responseBody);
}

// grabs HTML from DB response and caches it until the next time the DB is updated. Will be called at web server startup and every time the DB is written to.
function cacheDbResponseHtml(callback) {
  var responseBody = '';
  if (typeof callback === 'undefined') { callback = function() {}; }
  readFromButtonDb(responseBody, function(responseBodyReturn) {
    everythingAfterButtonDivCache = responseBodyReturn;
  });
  callback();
}

// Starts the web server, direct all requests to handleRequest()
function startWebServer() {
  http.createServer(handleRequest).listen(listenPort);
  console.log('Server running on port ' + listenPort);
}

// finally, read and cache the DB response HTML and then start the web server using a callback.
cacheDbResponseHtml(startWebServer);
