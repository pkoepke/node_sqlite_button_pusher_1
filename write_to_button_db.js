// used https://codeforgeek.com/2014/07/node-sqlite-tutorial/
// also used http://dalelane.co.uk/blog/?p=3152
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');

function writeToButtonDb(ipAddress, callback) {
  // default to an empty function if no callback is specified.
  if (typeof callback === 'undefined') { callback = function() {}; }

  db.serialize(function() {
    db.run("CREATE TABLE if not exists button_info (datetime TEXT)");
    var stmt = db.prepare("INSERT INTO button_info VALUES (?,?)");
    stmt.run(Date(), ipAddress);
    stmt.finalize(callback); // writeToButtonDb callback goes here so the callback does not run until the statement is done running.
    /*db.each("SELECT ROWID, datetime FROM button_info", function(err, row) {
      //console.log(row); // for testing
      // console.log("Entry " + row.rowid + ": " + row.datetime); // for testing
    }); */// for testing
  });
  // console.log("writeToButtonDb() ran."); // for testing
}

module.exports = writeToButtonDb;

// writeToButtonDb(); // un-comment this if running the script directly. If it's uncommented when the web server starts up then it writes to the DB as webserver.js grabs it.

// db.close(); // caused errors in webserver.js, so commented this out so it doesn't close the DB connection.
