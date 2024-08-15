import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Blog, Comment } from './blogsSlice'; 
import BASE_URL from '../../API/constants'; 

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllBlogs: builder.query<Blog[], void>({
      query: () => 'posts',
      
    }),

    getBlog: builder.query<Blog, string>({
      query: (id) => `posts/${id}?_embed=comments`,
    }),

    createBlog: builder.mutation<Blog, Partial<Blog>>({
      query: (newBlog) => ({
        url: 'posts',
        method: 'POST',
        body: newBlog,
      }),
    }),

    updateBlog: builder.mutation<Blog, { id: string; changes: Partial<Blog> }>({
      query: ({ id, changes }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: changes,
      }),
    }),

    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
    }),

    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: (newComment) => ({
        url: 'comments',
        method: 'POST',
        body: newComment,
      }),
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useCreateCommentMutation,
} = apiService;
