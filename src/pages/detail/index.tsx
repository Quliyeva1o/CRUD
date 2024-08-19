import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {useGetBlogQuery,useCreateCommentMutation} from "../../store/slices/apiService";
import Loader from "../../common/ui/loader";
import styles from "./index.module.scss";
import { useFormik, FormikHelpers } from "formik";
import Input from "../../common/ui/input";
import { CommentValues } from "../../types";
import { commentValidationSchema } from "../../utils/validations";
import Button from "../../common/ui/button";
import { commentFormFields } from "../../utils/formFields";

const Detail: React.FC = () => {
  // HOOKS
  const { id } = useParams<{ id: string }>();
  const { data: blog, error, isLoading } = useGetBlogQuery(id || "");
  const [addComment] = useCreateCommentMutation();
  // STATES
  const [notification, setNotification] = useState<{visible: boolean;message: string}>({ visible: false, message: "" });
  const [comments, setComments] = useState<any>([]);

  // EFFECTS
  useEffect(() => {
    setComments(blog?.comments);
  }, [blog]);

  // FORMİK
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      body: "",
    },
    validationSchema: commentValidationSchema,
    onSubmit: async (values, { resetForm }: FormikHelpers<CommentValues>) => {
      try {
        await addComment({ ...values, postId: blog?.id }).unwrap();
        setComments([...comments, values]);
        resetForm();

        // NOTIFICATION
        setNotification({
          visible: true,
          message: "Comment added successfully!",
        });
        setTimeout(() => {
          setNotification({ visible: false, message: "" });
        }, 3000);
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    },
  });

  // LOADINGS & ERRORS
  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blog details. Please try again later.</p>;
  if (!blog) return <p>No blog found.</p>;

  // RETURN
  return (
    <div className={styles.detail}>
      <img
        src={
          blog.img ||
          "https://i.pinimg.com/736x/9d/2b/bc/9d2bbc6b0d78d00f4ef6ad4dae7aa7ec.jpg"
        }
        alt={blog.title}
      />
      <h1>{blog.title}</h1>
      <p>{blog.body}</p>

      {comments?.length > 0 && (
        <div className={styles.comments}>
          <h2>Comments</h2>
          {comments.map((comment: any, idx: number) => (
            <div key={idx} className={styles.comment}>
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
          {commentFormFields?.map((input, idx) => (
            <Input
              key={idx}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formik.values[input.name as keyof CommentValues]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors[input.name as keyof CommentValues])}
              errorMessage={formik.errors[input.name as keyof CommentValues]}
            />
          ))}

          <Button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>

      {notification.visible && (
        <div className={styles.notification}>{notification.message}</div>
      )}
    </div>
  );
};

export default Detail;
