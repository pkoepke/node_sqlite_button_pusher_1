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
  var responseBody = fs.readFileSync('material_design_CSS_scripts_links.html')
  responseBody += "<h1>Button Presses</h1>\n";
  responseBody += fs.readFileSync('button_html.html');
  responseBody += "<p>Current path: " + request.url + "</p><p>Current client's IP address: " + request.connection.remoteAddress + "</p>";
  if (request.url.indexOf("favicon.ico") != -1) {
    // handle favicon.ico
    var img = fs.readFileSync('./favicon.ico');
    response.writeHead(200, {
      'Content-Type': 'image/gif'
    });
    response.end(img, 'binary');
  } else if(request.url.indexOf("button_client_js.js") != -1) {
    // handle button_client_js.js
    responseBody = fs.readFileSync('button_client_js.js');
    response.end(responseBody);
  } else if (request.url.indexOf("push_button") != -1) {
    // handle /push_button/
    response.end("You pushed the button!");
    buttonDbWrite(request.connection.remoteAddress);
  } else {
    // Finish the response by gathering all the button clicks
    db.all("SELECT ROWID, datetime, clientIp from button_info", function(err,rows) {
      rows.forEach(function(currentRow) {
        console.log(currentRow);
        dbResponse = "Entry " + currentRow.rowid + ": " + currentRow.datetime + " | Client IP address: " + currentRow.clientIp + "<br />";
        responseBody += dbResponse;
      })
      response.end(responseBody); // had to put this within the db.all call, which is async. If it's outside db.all then response.end runs before the async db.all call can finish so parts of the response are missing. This could be improved using promises so response.end would be called after db.all.
    });
  }
  console.log("Response sent, path \"" + request.url + "\""); // this results in nultiple console entries every time the page is refreshed because the web browser may request several files: /, favicon.ico, and any included script or CSS files.
  console.log("Client's IP address: " + request.connection.remoteAddress)
}

/* http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(listenPort); */

// Start the web server, direct all requests to handleRequest()
http.createServer(handleRequest).listen(listenPort);
console.log('Server running at http://127.0.0.1:' + listenPort + '/');
