import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";

export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settings.cbor";

let settings, onsettingschange;

export function initialize(callback) {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt) {
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
})

// Register for the unload event
me.addEventListener("unload", saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}