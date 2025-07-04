import { USER_URL } from "config/api";

import { apiSlice } from "services/baseQuery";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `${USER_URL}/get`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/update`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: `${USER_URL}/delete`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    imageActions: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/imageActions`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // Admin endpoints (duplicated for backwards compatibility)
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", role = "" } = {}) => ({
        url: `${USER_URL}/admin/all`,
        params: { page, limit, search, role },
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["AdminUsers"],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: `${USER_URL}/admin/stats`,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["AdminStats"],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USER_URL}/admin/user/${id}`,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "AdminUserDetails", id }],
    }),

    adminDeleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `${USER_URL}/admin/user/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `${USER_URL}/admin/user/${id}/role`,
        method: "PATCH",
        body: { role },
        credentials: "include",
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useImageActionsMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  // Legacy exports for backwards compatibility
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useGetUserDetailsQuery,
  useAdminDeleteUserMutation,
  useUpdateUserRoleMutation,
} = userApiSlice;
