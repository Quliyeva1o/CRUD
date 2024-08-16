import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "./slices/apiSlice";
import blogReducer from "./slices/blogsSlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;