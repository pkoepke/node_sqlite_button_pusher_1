var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');

var response = db.all("SELECT ROWID, datetime from button_info", function(err,rows) {
  rows.forEach(function(currentRow) {
    console.log("Entry " + currentRow.rowid + ": " + currentRow.datetime);
  })
});

db.close();
