import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isPlatformMobile, shouldUseTokenStorage } from "utils/platform";
import { tokenStorage } from "utils/tokenStorage";

const BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === "production"
    ? process.env.REACT_APP_RENDER_SERVER_URL
    : process.env.REACT_APP_API_URL;

const shouldUseStorage = shouldUseTokenStorage();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: shouldUseStorage ? "omit" : "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // For mobile or Safari, add tokens to headers
    if (shouldUseStorage) {
      const tokens = tokenStorage.getTokens();
      if (tokens?.accessToken) {
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      }
      if (tokens?.refreshToken) {
        headers.set("Refresh", tokens.refreshToken);
      }
    }

    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (shouldUseStorage && result.meta?.response?.headers) {
    const newToken = result.meta.response.headers.get("MobileToken");
    if (newToken) {
      tokenStorage.setTokens(newToken, tokenStorage.getTokens()?.refreshToken);
    }
  }

  return result;
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Transaction", "User", "Auth", "Categories"],
  endpoints: () => ({}),
});
