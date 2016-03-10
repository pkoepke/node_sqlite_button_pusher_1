"use strict";

function httpGetAsync(theUrl, callback) {
  // default to an empty function if no callback is specified
  if (typeof callback === 'undefined') { callback = function() {}; }
  var xmlHttp = new XMLHttpRequest();
  hideUnhideResizeLoadingSpinner('unhide');
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //console.log(xmlHttp.responseText); // for testing
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open('GET', theUrl, true); // third parameter should be 'true' for asynchronous or 'false' for sync. We want an async call so it's set to true'.
  xmlHttp.send(null);
}

function overWriteEverythingAfterButtonDiv(responseText) {
  document.getElementById('everythingAfterButton').innerHTML = responseText;
  convertAllTimesToClientTimezone();
  hideUnhideResizeLoadingSpinner('hide');
}

function convertTimeToClientTimezone(dateTimeToConvert) {
  dateTimeToConvert = new Date(dateTimeToConvert); // create new Date object based on dateTime
  dateTimeToConvert = dateTimeToConvert.getTime(); // turn Date object into milliseconds since 1970/01/01. Removes time zones entirely as miliseconds are universal. Tested same time in different time zones and the date > miliseconds > date conversion works correctly.
  dateTimeToConvert = new Date(dateTimeToConvert); // create a new Date object using miliseconds. Will be in client's time zone.
  dateTimeToConvert = dateTimeToConvert.toString().slice(0,25) + dateTimeToConvert.toString().slice(34); // Shorten the length of the datetime while keeping the timezone indicator. Everything will still work if this line is commented out.
  return dateTimeToConvert;
}

function convertAllTimesToClientTimezone() {
  var allTimeElements = document.getElementsByClassName('buttonPushTime');
  for (var i = 0; i < allTimeElements.length; i++) {
    allTimeElements[i].innerHTML = convertTimeToClientTimezone(allTimeElements[i].innerHTML);
  }
}

function hideUnhideResizeLoadingSpinner (action) { // Hides and un-hides spinner image. Checks every time tha it's the same height as the button.
  var buttonOffsetHeight = document.getElementById('pushButton').offsetHeight;
  var loadingSpinnerImg = document.getElementById('loadingSpinnerImg');
  loadingSpinnerImg.style.height = buttonOffsetHeight + 'px';
  if (action === 'hide') {
    loadingSpinnerImg.style.visibility = 'hidden';
  } else if (action === 'unhide') {
    loadingSpinnerImg.style.visibility = 'visible';
  }
}

// Courtesy of detectmobilebrowsers.com
function  detectmobilebrowsers_com() {
  var check = false;
  (function(a){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true}
  )(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

if (detectmobilebrowsers_com()) {
  document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="mobile.css">';
}
window.addEventListener('load',convertAllTimesToClientTimezone,false);
window.addEventListener('load', function() { hideUnhideResizeLoadingSpinner("hide"); },false);
