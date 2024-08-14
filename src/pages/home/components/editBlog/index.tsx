import React from "react";
import { useFormik, FormikHelpers } from "formik";
import { useUpdateBlogMutation, useGetBlogQuery} from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import Button from "../../../../components/button";
import Input from "../../../../components/input";
import Loader from "../../../../components/loader";
import { BlogFormValues } from "../../../../types";
import { blogValidationSchema } from "../../../../utils/validations";


const EditBlog: React.FC<EditBlogProps> = ({ postId, onClose }) => {

  const { data: blog, error, isLoading, refetch } = useGetBlogQuery(postId);
  const [updateBlog] = useUpdateBlogMutation();

  //FORMIK
  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: blog?.title || "",
      body: blog?.body || "",
      img: blog?.img || "",
    },
    validationSchema:blogValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }: FormikHelpers<BlogFormValues>) => {
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


  //LOADING && ERROR
  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blog. Please try again later.</p>;


  //COMPONENT
  return (
   <div className={styles.overlay}>
     <div
      className={styles.modal}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">

      <h2 id="modal-title">Edit Blog</h2>
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
              Boolean(formik.errors[name as keyof BlogFormValues]) }
            errorMessage={formik.errors[name as keyof BlogFormValues]}/>
        ))}

        <Button type="submit" color="#b13ce7">
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


//FORMFIELDS
const formFields = [
  { type: "text", name: "title", placeholder: "Title" },
  { type: "textarea", name: "body", placeholder: "Body" },
  { type: "text", name: "img", placeholder: "Image URL" },
];


interface EditBlogProps {
  postId: string;
  onClose: () => void;
}
