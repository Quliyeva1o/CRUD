import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteBlogMutation } from "../store/slices/apiSlice";
import { setBlogs } from "../store/slices/blogsSlice";
import { RootState } from "../store/store";

const useDeleteBlog = () => {
  const [deleteBlog] = useDeleteBlogMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();

  const handleDeleteBlog = async () => {
    if (deleteBlogId) {
      setLoading(true);
      try {
        await deleteBlog(deleteBlogId).unwrap();
        dispatch(setBlogs(blogs.filter((blog) => blog.id !== deleteBlogId)));
      } catch (error) {
        console.error("Failed to delete blog", error);
      } finally {
        setDeleteBlogId(null);
        setLoading(false);
      }
    }
  };

  return {
    deleteBlogId,
    setDeleteBlogId,
    handleDeleteBlog,
    loading
  };
};

export default useDeleteBlog;
