import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isPlatformMobile } from "utils/platform";
import { tokenStorage } from "utils/tokenStorage";

const BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === "test"
    ? process.env.REACT_APP_TEST_API_URL
    : process.env.REACT_APP_ENVIRONMENT === "production"
    ? process.env.REACT_APP_LIVE_API_URL
    : process.env.REACT_APP_API_URL;

const isMobile = isPlatformMobile();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: isMobile ? "omit" : "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // For mobile, add tokens to headers
    if (isMobile) {
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

  if (isMobile && result.meta?.response?.headers) {
    const newToken = result.meta.response.headers.get("mobileToken");
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
