import React, { useState, useEffect } from "react";
import "./style.css";
import { getDeviceType } from "utils/platform";

const DeviceFrameToggle = () => {
  const [showFrame, setShowFrame] = useState(false);
  const [deviceType, setDeviceType] = useState("ios"); // 'ios' or 'android'

  useEffect(() => {
    // Only show toggle in development environment
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev) return;

    // Only show on desktop
    if (getDeviceType() !== "desktop") return;

    // Check if frame was previously enabled
    const savedShowFrame = localStorage.getItem("showDeviceFrame") === "true";
    const savedDeviceType = localStorage.getItem("deviceFrameType") || "ios";

    setShowFrame(savedShowFrame);
    setDeviceType(savedDeviceType);

    // Apply frame if it was previously enabled
    if (savedShowFrame) {
      applyDeviceFrame(savedDeviceType);
    }
  }, []);

  const toggleFrame = () => {
    const newShowFrame = !showFrame;
    setShowFrame(newShowFrame);
    localStorage.setItem("showDeviceFrame", newShowFrame.toString());

    if (newShowFrame) {
      applyDeviceFrame(deviceType);
    } else {
      removeDeviceFrame();
    }
  };

  const changeDeviceType = (type) => {
    setDeviceType(type);
    localStorage.setItem("deviceFrameType", type);

    if (showFrame) {
      applyDeviceFrame(type);
    }
  };

  const applyDeviceFrame = (type) => {
    document.documentElement.classList.add("device-mobile");
    document.documentElement.classList.remove("ios-device", "android-device");
    document.documentElement.classList.add(`${type}-device`);
  };

  const removeDeviceFrame = () => {
    document.documentElement.classList.remove(
      "device-mobile",
      "ios-device",
      "android-device"
    );
  };

  // Only show in development environment and on desktop
  if (process.env.NODE_ENV !== "development" || getDeviceType() !== "desktop") {
    return null;
  }

  return (
    <div className="device-frame-toggle">
      <div className="toggle-container">
        <label className="toggle-switch">
          <input type="checkbox" checked={showFrame} onChange={toggleFrame} />
          <span className="slider round"></span>
        </label>
        <span className="toggle-label">Device Frame</span>
      </div>

      {showFrame && (
        <div className="device-type-selector">
          <button
            className={`device-type-btn ${
              deviceType === "ios" ? "active" : ""
            }`}
            onClick={() => changeDeviceType("ios")}
          >
            iOS
          </button>
          <button
            className={`device-type-btn ${
              deviceType === "android" ? "active" : ""
            }`}
            onClick={() => changeDeviceType("android")}
          >
            Android
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceFrameToggle;
