import { isPlatformMobile, shouldUseTokenStorage } from "./platform";

class TokenStorage {
  constructor() {
    this.shouldUseStorage = shouldUseTokenStorage();
  }
  setTokens(accessToken, refreshToken) {
    if (this.shouldUseStorage) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }
  getTokens() {
    if (this.shouldUseStorage) {
      return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      };
    }
    return null;
  }

  clearTokens() {
    if (this.shouldUseStorage) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
}

export const tokenStorage = new TokenStorage();
