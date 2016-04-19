A simple program for playing around with service files over HTTP with Nodejs. Just records timestamps of button presses in a sqlite database and returns a list of those timestamps in the web page.

Run webserver.js to start the server, and hit up the web server (localhost for local testing) on the right port to test it out (see webserver.js for the right port). I recommend using pm2 to manage the process.

Sites used:

Database / sqlite3:
Started from  https://codeforgeek.com/2014/07/node-sqlite-tutorial/
http://dalelane.co.uk/blog/?p=3152
https://github.com/mapbox/node-sqlite3/wiki/API

Web server:
http://stackoverflow.com/questions/6084360/using-node-js-as-a-simple-web-server
http://blog.modulus.io/build-your-first-http-server-in-nodejs

Serving an image: http://stackoverflow.com/a/5826883

Client JS to read a URL: http://stackoverflow.com/a/4033310

Style notes:
* JavaScript files use single quotes. HTML files, HTML within JS files, and CSS files get double quotes. JSON files get double quotes per the JSON standard.
