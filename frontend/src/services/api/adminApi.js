import { apiSlice } from "services/baseQuery";

const ADMIN_URL = "/api/admin";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", role = "" } = {}) => ({
        url: `${ADMIN_URL}/all`,
        params: { page, limit, search, role },
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["AdminUsers"],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/stats`,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["AdminStats"],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/user/${id}`,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "AdminUserDetails", id }],
    }),

    // User Categories
    getUserCategories: builder.query({
      query: (userId) => ({
        url: `${ADMIN_URL}/user/${userId}/categories`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, { userId }) => [
        { type: "Categories", id: userId },
      ],
    }),
    // User Transactions
    getUserTransactions: builder.query({
      query: (userId) => ({
        url: `${ADMIN_URL}/user/${userId}/transactions`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, { userId }) => [
        { type: "Transactions", id: userId },
      ],
    }),

    getUserTransactionsPaginated: builder.query({
      query: ({
        userId,
        type = "",
        page = 1,
        limit = 10,
        month = "",
        year = "",
      }) => ({
        url: `${ADMIN_URL}/user/${userId}/transactions-paginated`,
        params: { type, page, limit, month, year },
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["UserTransactions"],
    }),

    adminDeleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `${ADMIN_URL}/deleteUser/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `${ADMIN_URL}/updateUser/${id}/role`,
        method: "PATCH",
        body: { role },
        credentials: "include",
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"],
    }),

    // Add this new endpoint to fetch historical user data
    getUserHistoricalData: builder.query({
      query: (period = 30) => ({
        url: `${ADMIN_URL}/historical?period=${period}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UserStats"],
    }),

    getDatabaseStats: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/database-stats`,
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["DatabaseStats"],
    }),
    // Default Categories
    getDefaultCategories: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/getDefaultCategories`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["DefaultCategories"],
    }),

    addDefaultCategory: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/addDefaultCategory`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),

    updateDefaultCategory: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updateDefaultCategory/${data._id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),

    deleteDefaultCategory: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/deleteDefaultCategory/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),
    // Database Actions
    databaseActions: builder.mutation({
      query: ({ operation }) => ({
        url: `${ADMIN_URL}/dbActions/${operation}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["DatabaseStats"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useGetUserDetailsQuery,
  useGetUserCategoriesQuery,
  useGetUserTransactionsQuery,
  useAdminDeleteUserMutation,
  useUpdateUserRoleMutation,
  useGetUserHistoricalDataQuery,
  useGetDatabaseStatsQuery,
  useGetDefaultCategoriesQuery,
  useAddDefaultCategoryMutation,
  useUpdateDefaultCategoryMutation,
  useDeleteDefaultCategoryMutation,
  useDatabaseActionsMutation,
  useGetUserTransactionsPaginatedQuery,
} = adminApi;
