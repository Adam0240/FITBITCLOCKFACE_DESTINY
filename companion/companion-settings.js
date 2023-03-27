import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { device } from "peer";
import { outbox } from "file-transfer";
import { Image } from "image";

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