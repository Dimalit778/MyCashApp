import { isPlatformMobile } from "utils/platform";
import { apiSlice } from "../baseQuery";

import { tokenStorage } from "utils/tokenStorage";

const AUTH_URL = "/api/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        credentials: "include",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // For mobile, store tokens
          if (isPlatformMobile()) {
            tokenStorage.setTokens(
              data.data.accessToken,
              data.data.refreshToken
            );
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
      providesTags: ["Auth"],
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          if (isPlatformMobile()) {
            tokenStorage.clearTokens();
          }
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/googleAuth`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Auth"],
    }),
  }),
});
export const {
  useLoginMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useSignUpMutation,
} = authApiSlice;
