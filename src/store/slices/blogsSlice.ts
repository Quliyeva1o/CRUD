import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "./apiService";

// Initial state
export interface Comment {
  email: string;
  id: number;
  name: string;
  body: string;
  postId: string;
}

export interface Blog {
  comments?: Comment[];
  id: string;
  title: string;
  body: string;
  img?: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
};

// Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the state changes for `getAllBlogs`
      .addMatcher(apiService.endpoints.getAllBlogs.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.getAllBlogs.matchFulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.getAllBlogs.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load blogs";
      })
      // Handle the state changes for `getBlog`
      .addMatcher(apiService.endpoints.getBlog.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.getBlog.matchFulfilled, (state, action) => {
        const blogIndex = state.blogs.findIndex(blog => blog.id === action.payload.id);
        if (blogIndex > -1) {
          state.blogs[blogIndex] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.getBlog.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load blog";
      })
      // Handle the state changes for `createBlog`
      .addMatcher(apiService.endpoints.createBlog.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.createBlog.matchFulfilled, (state, action) => {
        state.blogs.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.createBlog.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create blog";
      })
      // Handle the state changes for `updateBlog`
      .addMatcher(apiService.endpoints.updateBlog.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.updateBlog.matchFulfilled, (state, action) => {
        const blogIndex = state.blogs.findIndex(blog => blog.id === action.payload.id);
        if (blogIndex > -1) {
          state.blogs[blogIndex] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.updateBlog.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog";
      })
      // Handle the state changes for `deleteBlog`
      .addMatcher(apiService.endpoints.deleteBlog.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.deleteBlog.matchFulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog.id !== action.meta.arg.originalArgs);  
        state.loading = false;
        state.error = null;
      })
      .addMatcher(apiService.endpoints.deleteBlog.matchRejected, (state, action) => {
        state.loading = false;        
        state.error = action.error.message || "Failed to delete blog";
      })
      
  },
});

export const { setBlogs, setLoading, setError } = blogSlice.actions;
export default blogSlice.reducer;
