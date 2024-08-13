import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
} from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
  img: Yup.string().url("Invalid image URL").required("Image URL is required"),
});

interface FormValues {
  title: string;
  body: string;
  img: string;
}

const AddBlog: React.FC = () => {
  const { refetch } = useGetAllBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [showModal, setShowModal] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      body: "",
      img: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }: FormikHelpers<FormValues>) => {
      createBlog(values)
        .then(() => {
          refetch();
          resetForm();
          setShowModal(false);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create blog. Please try again.");
        });
    },
  });

  return (
    <>
      <Button onClick={() => setShowModal(true)} color="#007bff">
        Create Blog
      </Button>

      {showModal && (
        <div
          className={styles.modal}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <h2 id="modal-title">Create a new blog</h2>
          <form onSubmit={formik.handleSubmit} className={styles.add_blog_form}>
            <Input
              type="text"
              name="title"
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              errorMessage={formik.errors.title}
            />

            <Input
              type="textarea"
              name="body"
              placeholder="Body"
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.body && Boolean(formik.errors.body)}
              errorMessage={formik.errors.body}
            />

            <Input
              type="text"
              name="img"
              placeholder="Image URL"
              value={formik.values.img}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.img && Boolean(formik.errors.img)}
              errorMessage={formik.errors.img}
            />

            <Button type="submit" color="#007bff">
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
        </div>
      )}
    </>
  );
};

export default AddBlog;
