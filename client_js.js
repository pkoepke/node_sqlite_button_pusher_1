//"use strict";

function httpGetAsync(theUrl, callback) {
  // default to an empty function if no callback is specified
  if (typeof callback === 'undefined') { callback = function() {}; }
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //console.log(xmlHttp.responseText); // for testing
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function overWriteEverythingAfterButtonDiv(responseText) {
  document.getElementById("everythingAfterButton").innerHTML = responseText;
  convertAllTimesToClientTimezone();
}

function convertTimeToClientTimezone(dateTimeToConvert) {
  dateTimeToConvert = new Date(dateTimeToConvert); // create new Date object based on dateTime
  dateTimeToConvert = dateTimeToConvert.getTime(); // turn Date object into milliseconds since 1970/01/01. Removes time zones entirely as miliseconds are universal. Tested same time in different time zones and the date > miliseconds > date conversion works correctly.
  dateTimeToConvert = new Date(dateTimeToConvert); // create a new Date object using miliseconds. Will be in client's time zone.
  // dateTimeToConvert = dateTimeToConvert.toISOString().slice(0,10) + " " + dateTimeToConvert.toISOString().slice(11,18) + " (" + dateTimeToConvert.toString().slice(-4,-1) + ")"; // Shorten the length of the datetime while keeping the timezone indicator. Everything will still work if this line is commented out.
  return dateTimeToConvert;
}

function convertAllTimesToClientTimezone() {
  var allTimeElements = document.getElementsByClassName('buttonPushTime');
  for (var i = 0; i < allTimeElements.length; i++) {
    allTimeElements[i].innerHTML = convertTimeToClientTimezone(allTimeElements[i].innerHTML);
  }
}

window.addEventListener('load',convertAllTimesToClientTimezone,false);
