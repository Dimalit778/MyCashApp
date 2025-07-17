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

// Safari has issues with cookies in development, so we'll treat it as mobile
export const shouldUseTokenStorage = () => {
  return isPlatformMobile() || isSafari();
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
