function emptyFunction() {}

function httpGetAsync(theUrl, callback) {
  if (typeof callback === 'undefined') {
    callback = emptyFunction;
  }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
