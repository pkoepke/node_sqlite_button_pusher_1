var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('button_db.db');

function readFromButtonDb(responseBody, callback) {
  // default to an empty function if no callback is specified
  if (typeof callback === 'undefined') { callback = function() {}; }
  var returnRowsReverseOrder = "";
  db.all("SELECT ROWID, datetime, clientIp from button_info", function(err,rows) {
    rows.forEach(function(currentRow) {
      returnRowsReverseOrder = "Entry " + currentRow.rowid + ": <span class=\"buttonPushTime\">" + currentRow.datetime + "</span> | Client IP address: " + currentRow.clientIp + "<br />\n" + returnRowsReverseOrder;
    });
    responseBody += returnRowsReverseOrder;
    callback(responseBody);
  });
}

module.exports = readFromButtonDb;
