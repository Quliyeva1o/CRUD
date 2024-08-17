import { useState, useEffect } from "react";
import { useFormik, FormikHelpers } from "formik";
import { useUpdateBlogMutation } from "../store/slices/apiSlice";
import { BlogFormValues } from "../types";
import { blogValidationSchema } from "../utils/validations";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setBlogs } from "../store/slices/blogsSlice";

interface UseEditBlogProps {
  postId: string;
  onClose: () => void;
}

const useEditBlog = ({ postId, onClose }: UseEditBlogProps) => {
  const [updateBlog] = useUpdateBlogMutation();
  const [blog, setBlog] = useState<{ id: string; img?: string; title: string; body: string } | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    setBlog(blogs.find((x) => x.id === postId));
  }, [blogs, postId]);

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: blog?.title || "",
      body: blog?.body || "",
      img: blog?.img || "",
    },
    validationSchema: blogValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }: FormikHelpers<BlogFormValues>) => {
      setLoading(true);
      try {
        const updatedBlog = await updateBlog({
          id: postId,
          changes: values,
        }).unwrap();

        dispatch(
          setBlogs(blogs.map((b) => (b.id === postId ? updatedBlog : b)))
        );
        resetForm();
        onClose();
      } catch (err) {
        console.error("Failed to update the blog:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    formik,
    loading,
  };
};

export default useEditBlog;
