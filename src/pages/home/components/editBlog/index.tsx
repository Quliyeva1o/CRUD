import React from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  useUpdateBlogMutation,
  useGetBlogQuery,
} from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";
import Loader from "../../../../components/loader";

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

interface EditBlogProps {
  postId: string;
  onClose: () => void;
}

const EditBlog: React.FC<EditBlogProps> = ({ postId, onClose }) => {
  const { data: blog, error, isLoading, refetch } = useGetBlogQuery(postId);
  const [updateBlog] = useUpdateBlogMutation();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: blog?.title || "",
      body: blog?.body || "",
      img: blog?.img || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }: FormikHelpers<FormValues>) => {
      try {
        await updateBlog({ id: postId, changes: values }).unwrap();
        resetForm();
        onClose();
        refetch();
      } catch (err) {
        console.log(err);
        alert("Failed to edit blog. Please try again.");
      }
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blog. Please try again later.</p>;

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <h2 id="modal-title">Edit Blog</h2>
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
          Save Changes
        </Button>
        <Button type="button" onClick={onClose} color="#dc3545">
          Close
        </Button>
      </form>
    </div>
  );
};

export default EditBlog;
