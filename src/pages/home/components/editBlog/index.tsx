import React, { useState, useEffect } from "react";
import { useFormik, FormikHelpers } from "formik";
import { useUpdateBlogMutation } from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";
import { blogFormFields } from "../../../../utils/formFields";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
const EditBlog: React.FC<EditBlogProps> = ({ postId, onClose, onUpdate }) => {
  const [updateBlog] = useUpdateBlogMutation();
  const [blog, setBlog] = useState<{ id: string; img?: string; title: string; body: string } | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { blogs } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    setBlog(blogs.find((x) => x.id == postId));
  }, [blogs]);

  // FORMİK
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
        resetForm();
        onUpdate(updatedBlog);
        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });

  // COMPONENT
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Blog</h2>
        <form onSubmit={formik.handleSubmit} className={styles.add_blog_form}>
          {blogFormFields.map(({ type, name, placeholder }) => (
            <Input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formik.values[name as keyof BlogFormValues]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched[name as keyof BlogFormValues] &&
                Boolean(formik.errors[name as keyof BlogFormValues])
              }
              errorMessage={formik.errors[name as keyof BlogFormValues]}
            />
          ))}
          <Button type="submit" color="#eb3e8c" loading={loading}>
            Save Changes
          </Button>
          <Button type="button" onClick={onClose} color="#dc3545">
            Close
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;

interface EditBlogProps {
  postId: string;
  onClose: () => void;
  onUpdate: (updatedBlog: {
    id: string;
    title: string;
    body: string;
    img?: string;
  }) => void;
}
