import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
});

export const { setBlogs, setLoading, setError } = blogSlice.actions;
export default blogSlice.reducer;
