// used https://codeforgeek.com/2014/07/node-sqlite-tutorial/
// also used http://dalelane.co.uk/blog/?p=3152
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');

function writeToButtonDb() {

  db.serialize(function() {

    db.run("CREATE TABLE if not exists button_info (datetime TEXT)");
    var stmt = db.prepare("INSERT INTO button_info VALUES (?)");

    stmt.run(Date());

    stmt.finalize();

    db.each("SELECT ROWID, datetime FROM button_info", function(err, row) {
      //console.log(row);
      console.log("Entry " + row.rowid + ": " + row.datetime);
    });
  });
}

module.exports = writeToButtonDb;

// writeToButtonDb(); // un-comment this if running the script directly. If it's uncommented when the web server starts up then it writes to the DB as webserver.js grabs it.

// db.close(); // caused errors in webserver.js, so commented this out so it doesn't close the DB connection.
