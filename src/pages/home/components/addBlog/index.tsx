import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import { useCreateBlogMutation } from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";
import { blogFormFields } from "../../../../utils/formFields";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../../../../redux/slices/blogsSlice";
import Modal from "../../../../components/modal";
import { RootState } from "../../../../redux/store";

const AddBlog: React.FC = () => {
  const [createBlog] = useCreateBlogMutation();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { blogs } = useSelector((state: RootState) => state.blogs);

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: "",
      body: "",
      img: "", },
    validationSchema: blogValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }: FormikHelpers<BlogFormValues>) => {
      try {
        setSubmitting(true);
        const newBlog = { ...values, id: nanoid() };
        dispatch(setBlogs([...blogs, newBlog]));
        await createBlog(newBlog).unwrap();
        resetForm();
        setShowModal(false);
      } catch (err) {
        console.error("Failed to create blog:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Button onClick={() => setShowModal(true)} color="#eb3e8c">
        Create Blog
      </Button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Create a new blog</h2>
        <form
          onSubmit={formik.handleSubmit}
          className={styles.add_blog_form}>
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
          <Button type="submit" color="#eb3e8c" loading={formik.isSubmitting}>
            Create Blog
          </Button>
          <Button
            type="button"
            onClick={() => setShowModal(false)}
            color="#dc3545"
          >
            Close
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddBlog;
