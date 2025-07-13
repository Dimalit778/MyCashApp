import { apiSlice } from "services/baseQuery.js";

const CATEGORY_URL = "/api/categories";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ type }) => ({
        url: `${CATEGORY_URL}/get?type=${type}`,
        credentials: "include",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    addCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `${CATEGORY_URL}/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} = categoriesApiSlice;
