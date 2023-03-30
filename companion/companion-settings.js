import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { device } from "peer";
import { outbox } from "file-transfer";
import { Image } from "image";

import { geolocation } from "geolocation";
// Set the OpenWeatherMap API endpoint URL and your API key
const apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "7d919a4f6aac2a579ace04fab2b97201";


//export function getWeather() {
// Get the device's location using the Fitbit SDK
geolocation.getCurrentPosition(position => {
 const { latitude, longitude } = position.coords;
//  const latitude = 33.563869;
//  const longitude = -81.716148

  // Construct the API URL with the location information and API key
  const apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

  // Make an HTTP request to the OpenWeatherMap API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Extract the current weather information from the API response
      const currentWeather = data.weather[0].description;
      const currentTemperature = data.main.temp;
      messaging.peerSocket.send({temperature: currentTemperature});

    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
}, error => {
  console.log(`Error: ${error}`);
}, { timeout: 10000 });
//}




// Grabs the device screen size
settingsStorage.setItem("screenWidth", device.screen.width);
settingsStorage.setItem("screenHeight", device.screen.height);

// Checks if there is a new value from the companion app
export function initialize() {
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
        if (evt.key === "wallpaper-image") {
            compressAndTransferImage(evt.newValue);
          }
        else
            sendValue(evt.key, evt.newValue);
    }
    
  });
}

// Sends data to the sendSettingsData function
function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

// Checks if the messaging socket is open and connected the sends data from the settings menu to the inbox
function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

// Compresses Image
function compressAndTransferImage(settingsValue) {
  const imageData = JSON.parse(settingsValue);
  Image.from(imageData.imageUri)
    .then(image =>
      image.export("image/jpeg", {
        background: "#FFFFFF",
        quality: 40
      })
    )
    .then(buffer => outbox.enqueue(`${Date.now()}.jpg`, buffer))
    .then(fileTransfer => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}