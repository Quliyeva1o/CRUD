import { useState } from "react";
import { useDeleteBlogMutation } from "../store/slices/apiService";

const useDeleteBlog = () => {
  const [deleteBlog] = useDeleteBlogMutation();
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const handleDeleteBlog = async () => {
    if (deleteBlogId) {
      try {
        await deleteBlog(deleteBlogId).unwrap();
      } finally {
        setDeleteBlogId(null);
      }
    }
  };

  return {
    deleteBlogId,
    setDeleteBlogId,
    handleDeleteBlog,
  };
};

export default useDeleteBlog;
