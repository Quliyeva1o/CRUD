import { useState } from "react";
import { useDeleteBlogMutation } from "../store/slices/apiService";

const useDeleteBlog = () => {
  const [deleteBlog] = useDeleteBlogMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const handleDeleteBlog = async () => {
    if (deleteBlogId) {
      setLoading(true);
      setError(null);
      try {
        await deleteBlog(deleteBlogId).unwrap()      
      } catch (err) {
        setError("Failed to delete blog");
        console.error("Failed to delete blog", err);
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
    loading,
    error,
  };
};

export default useDeleteBlog;
