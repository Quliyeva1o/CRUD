import React from "react";
import { useFormik, FormikHelpers } from "formik";
import Button from "../../../../common/ui/button";
import Input from "../../../../common/ui/input";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";
import { blogFormFields } from "../../../../utils/formFields";
import Modal from "../../../../common/ui/modal";
import useEditBlog from "../../../../hooks/useEditBlog";
import styles from "./index.module.scss";

interface EditBlogProps {
  postId: string;
  onClose: () => void;
}

const EditBlog: React.FC<EditBlogProps> = ({ postId, onClose }) => {
  const { blog, loading, handleUpdateBlog } = useEditBlog(postId, onClose);

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: blog?.title || "",
      body: blog?.body || "",
      img: blog?.img || "",
    },
    validationSchema: blogValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }: FormikHelpers<BlogFormValues>) => {
      await handleUpdateBlog(values);
      resetForm();
    },
  });

  return (
    <Modal show={true} onClose={onClose}>
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
            error={formik.touched[name as keyof BlogFormValues] &&
              Boolean(formik.errors[name as keyof BlogFormValues])}
            errorMessage={formik.errors[name as keyof BlogFormValues]}/>
        ))}
        <Button type="submit" color="#eb3e8c" loading={loading}>
          Save Changes
        </Button>
        <Button type="button" onClick={onClose} color="#dc3545">
          Close
        </Button>
      </form>
    </Modal>
  );
};

export default EditBlog;
