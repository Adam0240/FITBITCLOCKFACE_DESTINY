import clock from "clock";
import * as document from "document";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
// import * as messaging from "messaging";
import { display } from "display";
import * as fs from "fs";
import { inbox } from "file-transfer";
// import { preferences } from "user-settings";
import { me } from "appbit";
import * as colorSettings from "./color-settings";
import { SETTINGS_TYPE, SETTINGS_FILE } from "./color-settings";

// import { days, months, monthsShort } from "./locales/en.js";

// Fetch UI elements we will need to change
let hrLabel = document.getElementById("hrm");
let stepsCounter = document.getElementById("stepsCounter");
let dateDisplay = document.getElementById("dateDisplay");
let tnum1 = document.getElementById("tnum1");
let tnum2 = document.getElementById("tnum2");
let tnum3 = document.getElementById("tnum3");
let tnum4 = document.getElementById("tnum4");
let minuteHand = document.getElementById("minuteHand");
let hoursHand = document.getElementById("hoursHand");
let secondHand = document.getElementById('secondsHand');
let secondsHandCircle = document.getElementById('secondsCircle');
let imageHeart = document.getElementById('imageHeart');
let imageSteps = document.getElementById('imageSteps');

// Keep a timestamp of the last reading received. Start when the app is started.
let lastValueTimestamp = Date.now();

// This function takes a number of milliseconds and returns a string
// such as "5min ago".
function convertMsAgoToString(millisecondsAgo) {
    if (millisecondsAgo < 120*1000) {
      return Math.round(millisecondsAgo / 1000) + "s ago";
    }
    else if (millisecondsAgo < 60*60*1000) {
      return Math.round(millisecondsAgo / (60*1000)) + "min ago";
    }
    else {
      return Math.round(millisecondsAgo / (60*60*1000)) + "h ago"
    }
  }
  
  // Updates the users steps
  clock.ontick = (evt) => {
    if(appbit.permissions.granted("access_activity")) {
      stepsCounter.text = `${today.adjusted.steps}`;
    }
  }
  
  //get current date
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  // This arrangement can be altered based on how we want the date's format to appear

  // var dayName = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT']

  var monthName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  var displayMonthName = monthName[month - 1];

  var currentDate = `${displayMonthName}` + ' ' + `${day}`;

  console.log(currentDate); // "12-6"
  dateDisplay.text = currentDate;


  // Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor();

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  // Peek the current sensor values
  console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = hrm.heartRate;
  lastValueTimestamp = Date.now();
}

// Begin monitoring the sensor
hrm.start();

// And update the display every second
//setInterval(updateDisplay, 1000);

// Tick every second
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);



/************************Color Settings **************************/


function settingsCallback(data) {
  if (!data) {
    return;
  }
  if (data.stepsColor) {
    stepsCounter.style.fill = data.stepsColor;
  }
  if (data.dateColor) {
    dateDisplay.style.fill = data.dateColor;;
  }
  if (data.colorHRM) {
    hrLabel.style.fill = data.colorHRM;
  }
  if (data.clockNumbersColor) {
    tnum1.style.fill = data.clockNumbersColor;
    tnum2.style.fill = data.clockNumbersColor;
    tnum3.style.fill = data.clockNumbersColor;
    tnum4.style.fill = data.clockNumbersColor;
  }
  if (data.minColor) { 
    minuteHand.style.fill = data.minColor;
  }
  if (data.hourColor) {
    hoursHand.style.fill = data.hourColor;
  }
  if (data.secondsColor) {
    secondHand.style.fill = data.secondsColor;
    secondsHandCircle.style.fill = data.secondsColor;
  }
  if (data.colorHeartIMG) {
    imageHeart.style.fill = data.colorHeartIMG;
  }
  if (data.colorStepsIMG) {
    imageSteps.style.fill = data.colorStepsIMG;
  }
}
colorSettings.initialize(settingsCallback);


/************************Photo Picker ***************************/

let myWallpaper = document.getElementById("wallpaper");

let mySettings;
loadSettings();
me.onunload = saveSettings;

// Sets up inbox for receiving new files
inbox.onnewfile = () => {
  let fileName;
  do {
    fileName = inbox.nextFile();
    if (fileName) {
      if (mySettings.bg && mySettings.bg !== "") {
        fs.unlinkSync(mySettings.bg);
      }
      mySettings.bg = `/private/data/${fileName}`;
      applySettings();
    }
  } while (fileName);
};


// loads saved settings
function loadSettings() {
  try {
    mySettings = fs.readFileSync(SETTINGS_FILE, mySettings, SETTINGS_TYPE);
  } catch (ex) {
    mySettings = {};
  }
  applySettings();
}

// saves current settings
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, mySettings, SETTINGS_TYPE);
}

// applies settings
function applySettings() {
  if (mySettings.bg && fs.existsSync(mySettings.bg)) {
    myWallpaper.image = mySettings.bg;
  }
  display.on = true;
}
