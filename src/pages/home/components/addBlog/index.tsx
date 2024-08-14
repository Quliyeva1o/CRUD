import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
} from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";
import ButtonLoader from "../../../../components/buttonLoader";

const AddBlog: React.FC = () => {
  const { refetch } = useGetAllBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  //FORMIK
  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: "",
      body: "",
      img: "",
    },
    validationSchema: blogValidationSchema,
    onSubmit: (values, { resetForm }: FormikHelpers<BlogFormValues>) => {
      setLoading(true);
      createBlog(values)
        .then(() => {
          refetch();
          resetForm();
          setShowModal(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create blog. Please try again.");
          setLoading(false);
        });
    },
  });

  //COMPONENT
  return (
    <>
      <Button onClick={() => setShowModal(true)} color="#eb3e8c">
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
            {formFields.map(({ type, name, placeholder }) => (
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

            <Button type="submit" color="#eb3e8c">
              {loading ? <ButtonLoader /> : "Create Blog"}
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

//FORMFIELDS
const formFields = [
  { type: "text", name: "title", placeholder: "Title" },
  { type: "textarea", name: "body", placeholder: "Body" },
  { type: "text", name: "img", placeholder: "Image URL" },
];
