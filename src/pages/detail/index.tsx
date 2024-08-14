import React from "react";
import { useParams } from "react-router-dom";
import {useGetBlogQuery,useCreateCommentMutation} from "../../redux/slices/apiSlice";
import Loader from "../../components/loader";
import styles from "./index.module.scss";
import { useFormik, FormikHelpers } from "formik";
import Input from "../../components/input";
import { CommentValues } from "../../types";
import { commentValidationSchema } from "../../utils/validations";
import Button from "../../components/button";
import { commentFormFields } from "../../utils/formFields";

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, error, isLoading, refetch } = useGetBlogQuery(id || "");
  const [addComment] = useCreateCommentMutation();

  ///FORMIK
  const formik = useFormik<CommentValues>({
    initialValues: {
      name: "",
      email: "",
      body: "",
    },
    validationSchema: commentValidationSchema,
    onSubmit: async (values, { resetForm }: FormikHelpers<CommentValues>) => {
      try {
        await addComment({ ...values, postId: blog?.id }).unwrap();
        refetch();
        resetForm();
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    },
  });

  //LOADINGS ERRORS
  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blog details. Please try again later.</p>;
  if (!blog) return <p>No blog found.</p>;

  //RETURN
  return (
    <div className={styles.detail}>
      <h1>{blog.title}</h1>
      <img
        src={  blog.img || "https://i.pinimg.com/236x/97/43/ec/9743ecac80966a95e9d328c08b995c04.jpg" }
        alt={blog.title}
      />
      <p>{blog.body}</p>

      {blog.comments.length > 0 && (
        <div className={styles.comments}>
          <h2>Comments</h2>
          {blog.comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <h3>{comment.name}</h3>
              <p>
                <strong>Email:</strong> {comment.email}
              </p>
              <p>{comment.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.commentForm}>
        <h2>Leave a Comment</h2>
        <form onSubmit={formik.handleSubmit}>
          {commentFormFields.map((input) => (
            <Input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formik.values[input.name as keyof CommentValues]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched[input.name as keyof CommentValues] &&
                Boolean(formik.errors[input.name as keyof CommentValues])
              }
              errorMessage={formik.errors[input.name as keyof CommentValues]}
            />
          ))}
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Detail;
