import { apiSlice } from "services/baseQuery";
import { DEFAULT_CATEGORY_URL } from "config/api.js";
export const defaultCategoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDefaultCategories: builder.query({
      query: () => ({
        url: DEFAULT_CATEGORY_URL,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["DefaultCategories"],
    }),

    addDefaultCategory: builder.mutation({
      query: (data) => ({
        url: `${DEFAULT_CATEGORY_URL}/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),

    updateDefaultCategory: builder.mutation({
      query: (data) => ({
        url: `${DEFAULT_CATEGORY_URL}/update/${data._id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),

    deleteDefaultCategory: builder.mutation({
      query: (id) => ({
        url: `${DEFAULT_CATEGORY_URL}/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["DefaultCategories"],
    }),
  }),
});

export const {
  useGetDefaultCategoriesQuery,
  useAddDefaultCategoryMutation,
  useUpdateDefaultCategoryMutation,
  useDeleteDefaultCategoryMutation,
} = defaultCategoriesApiSlice;
