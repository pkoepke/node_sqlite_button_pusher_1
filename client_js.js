//"use strict";

function httpGetAsync(theUrl, callback) {
  // default to an empty function if no callback is specified
  if (typeof callback === 'undefined') {
    callback = function() {};
  }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log(xmlHttp.responseText);
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function overWriteButtonPushesDiv(responseText) {
  document.getElementById("buttonPushes").innerHTML = responseText;
}

function convertTimeToClientTimezone(dateTimeToConvert) {
  dateTimeToConvert = new Date(dateTimeToConvert); // create new Date object based on dateTime
  dateTimeToConvert = dateTimeToConvert.getTime(); // turn Date object into milliseconds since 1970/01/01. Removes time zones entirely as miliseconds are universal. Tested same time in different time zones and the date > miliseconds > date conversion works correctly.
  dateTimeToConvert = new Date(dateTimeToConvert); // create a new Date object using miliseconds. Will be in client's time zone.
  return dateTimeToConvert;
}

function convertAllTimesToClientTimezone() {
  var allTimeElements = document.getElementsByClassName('buttonPushTime');
  for (var i = 0; i < allTimeElements.length; i++) {
    allTimeElements[i].innerHTML = convertTimeToClientTimezone(allTimeElements[i].innerHTML);
  }
}

convertAllTimesToClientTimezone();
