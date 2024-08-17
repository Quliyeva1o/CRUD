import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateBlogMutation } from "../store/slices/apiSlice";
import { setBlogs } from "../store/slices/blogsSlice";
import { RootState } from "../store/store";
import { BlogFormValues } from "../types";

const useAddBlog = () => {
  const [createBlog] = useCreateBlogMutation();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { blogs } = useSelector((state: RootState) => state.blogs);

  const handleCreateBlog = async (values: BlogFormValues) => {
    try {
      const res = await createBlog(values).unwrap();
      dispatch(setBlogs([...blogs, res]));
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
