import React from "react";
import { BlogFormValues } from "../../../../types";
import Input from "../../../../common/ui/input";
import Button from "../../../../common/ui/button";
import Modal from "../../../../common/ui/modal";
import useEditBlog from "../../../../hooks/useEditBlog";
import styles from "./index.module.scss";
import { blogFormFields } from "../../../../utils/formFields";

interface EditBlogProps {
  postId: string;
  onClose: () => void;
}

const EditBlog: React.FC<EditBlogProps> = ({ postId, onClose }) => {

  //USEEDITBLOG HOOK
  const { formik, loading } = useEditBlog({ postId, onClose });

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
    </Modal>
  );
};

export default EditBlog;
