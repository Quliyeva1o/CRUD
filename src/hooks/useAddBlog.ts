import { useState } from "react";
import { useCreateBlogMutation } from "../store/slices/apiService";
import { BlogFormValues } from "../types";

const useAddBlog = () => {
  const [createBlog] = useCreateBlogMutation();
  const [showModal, setShowModal] = useState(false);

  const handleCreateBlog = async (values: BlogFormValues) => {
    try {
    await createBlog(values).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create blog:", err);
    }
  };

  return {
    showModal,
    setShowModal,
    handleCreateBlog
  };
};

export default useAddBlog;
