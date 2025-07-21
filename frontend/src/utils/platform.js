export const isPlatformMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const shouldUseTokenStorage = () => {
  const currentHost = window.location.hostname;
  let backendUrl = "";

  if (process.env.REACT_APP_ENVIRONMENT === "production") {
    backendUrl = process.env.REACT_APP_RENDER_SERVER_URL || "";
  } else {
    backendUrl = process.env.REACT_APP_API_URL || "";
  }

  let backendHost = "";
  try {
    if (backendUrl) {
      backendHost = new URL(backendUrl).hostname;
    }
  } catch (e) {
    backendHost = "";
  }

  const isCrossDomain = backendHost !== currentHost && backendHost !== "";

  return isPlatformMobile() || isSafari() || isCrossDomain;
};

export const applyDeviceSpecificStyles = () => {
  const deviceType = getDeviceType();
  document.documentElement.classList.add(`device-${deviceType}`);

  if (isIOS()) {
    document.documentElement.classList.add("ios-device");
  } else if (isAndroid()) {
    document.documentElement.classList.add("android-device");
  }

  if (isSafari()) {
    document.documentElement.classList.add("safari-browser");
  }
};
