import {  useSelector } from "react-redux";
import { useUpdateBlogMutation } from "../store/slices/apiService";
import { RootState } from "../store/store";
import { BlogFormValues } from "../types";

const useEditBlog = (postId: string, onClose: () => void) => {
  const [updateBlog] = useUpdateBlogMutation();
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);
  const blog = blogs.find((x) => x.id === postId);

  const handleUpdateBlog = async (values: BlogFormValues) => {
    try {
      await updateBlog({ id: postId, changes: values }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };

  return {
    blog,
    loading, 
    handleUpdateBlog,
  };
};

export default useEditBlog;
