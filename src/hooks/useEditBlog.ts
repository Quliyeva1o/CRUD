import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateBlogMutation } from "../store/slices/apiSlice";
import { setBlogs } from "../store/slices/blogsSlice";
import { RootState } from "../store/store";
import { BlogFormValues } from "../types";

const useEditBlog = (postId: string, onClose: () => void) => {
  const [updateBlog] = useUpdateBlogMutation();
  const [blog, setBlog] = useState<{ id: string; img?: string; title: string; body: string } | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    setBlog(blogs.find((x) => x.id === postId));
  }, [blogs, postId]);

  const handleUpdateBlog = async (values: BlogFormValues) => {
    setLoading(true);
    try {
      const updatedBlog = await updateBlog({
        id: postId,
        changes: values,
      }).unwrap();
      dispatch(
        setBlogs(blogs.map((blog) => (blog.id === postId ? updatedBlog : blog)))
      );
      onClose();
    } catch (err) {
      console.error("Failed to update blog:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    blog,
    loading,
    handleUpdateBlog,
  };
};

export default useEditBlog;
