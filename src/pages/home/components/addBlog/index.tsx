import React from "react";
import { useFormik, FormikHelpers } from "formik";
import Button from "../../../../common/ui/button";
import Input from "../../../../common/ui/input";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";
import { blogFormFields } from "../../../../utils/formFields";
import Modal from "../../../../common/ui/modal";
import useAddBlog from "../../../../hooks/useAddBlog";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";

const AddBlog: React.FC = () => {

  const { showModal, setShowModal, handleCreateBlog } = useAddBlog();
  const { loading } = useSelector((state: RootState) => state.blogs);

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: "",
      body: "",
      img: "",
    },
    validationSchema: blogValidationSchema,
    onSubmit: async (values,{ resetForm }: FormikHelpers<BlogFormValues>) => {
      await handleCreateBlog(values);
      resetForm();
    },
  });

  return (
    <>
      <Button onClick={() => setShowModal(true)} color="#eb3e8c">
        Create Blog
      </Button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2 className={styles.modalHeading}>Create a new blog</h2>
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
            Create Blog
          </Button>
          <Button
            type="button"
            onClick={() => setShowModal(false)}
            color="#dc3545">
            Close
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddBlog;
