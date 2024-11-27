import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Utility function to extract token from state (optional, depending on your structure)
const extractToken = (state) => state?.authReducer?.token;

const blogService = createApi({
  reducerPath: "blog", // Key for the API state slice
  tagTypes: ["BlogOperation"], // Tag types for cache invalidation
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL, // Use env variable for base URL
    prepareHeaders: (headers, { getState }) => {
      const token = extractToken(getState());
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all blogs
    getBlogs: builder.query({
      query: () => "/api/allblogs",
      providesTags: ["BlogOperation"], // Cache invalidation tag
    }),

    // Fetch a single blog by subCategory (or ID)
    getSingleBlog: builder.query({
      query: (subCategory) => `/api/blogblogsdetails/${subCategory}`,
      providesTags: ["BlogOperation"],
    }),

    // Create a new blog post
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/api/blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "BlogOperation", id: "LIST" }], // Invalidate blog list cache
    }),

    // Update an existing blog post
    updateBlog: builder.mutation({
      query: ({ _id, values }) => ({
        url: `/api/blog/update/${_id}`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: [{ type: "BlogOperation", id: "LIST" }], // Invalidate blog list cache
    }),

    // Delete a blog post by ID
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blog/delete/${id}`,
        method: "GET",
      }),
      invalidatesTags: [{ type: "BlogOperation", id: "LIST" }], // Invalidate blog list cache
    }),

    // Fetch blogs by category name
    getBlogsByCategory: builder.query({
      query: (categoryName) => `/api/categoryblogs/${categoryName}`,
      providesTags: ["BlogOperation"],
    }),

    // Fetch blogs by subcategory name
    getBlogsBySubCategory: builder.query({
      query: (subCategoryName) => `/api/subcategoryblogs/${subCategoryName}`,
      providesTags: ["BlogOperation"],
    }),

    // Search blogs by query string
    getBlogsBySearch: builder.query({
      query: (query) => `/api/searchblog?name=${query}`,
      providesTags: ["BlogOperation"],
    }),

    // Fetch all blog categories
    getAllCategoriesBlogs: builder.query({
      query: () => "/api/allcategoryblogs",
      providesTags: ["BlogOperation"],
    }),

    // Create a comment on a blog post
    createComment: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/leavecomment/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "BlogOperation", id: "LIST" }], // Cache invalidation for blog list
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetSingleBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsByCategoryQuery,
  useGetBlogsBySubCategoryQuery,
  useGetBlogsBySearchQuery,
  useGetAllCategoriesBlogsQuery,
  useCreateCommentMutation,
} = blogService;

export default blogService;
