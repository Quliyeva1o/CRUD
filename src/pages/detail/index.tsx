import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlogQuery, useCreateCommentMutation } from '../../redux/slices/apiSlice';
import Loader from '../../components/loader';
import styles from './index.module.scss';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/input'; 

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  body: Yup.string().required('Comment is required'),
});

interface CommentValues {
  name: string;
  email: string;
  body: string;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, error, isLoading, refetch } = useGetBlogQuery(id || '');
  const [addComment] = useCreateCommentMutation();

  const formik = useFormik<CommentValues>({
    initialValues: {
      name: '',
      email: '',
      body: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }: FormikHelpers<CommentValues>) => {
      try {
        await addComment({ ...values, postId: blog?.id }).unwrap();
        refetch();
        resetForm();
      } catch (err) {
        console.error('Failed to add comment:', err);
      }
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blog details. Please try again later.</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className={styles.detail}>
      <h1>{blog.title}</h1>
      <img
        src={
          blog.img ||
          'https://i.pinimg.com/236x/97/43/ec/9743ecac80966a95e9d328c08b995c04.jpg'
        }
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
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            errorMessage={formik.errors.name}
          />

          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            errorMessage={formik.errors.email}
          />

          <Input
            type="textarea"
            name="body"
            placeholder="Your Comment"
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.body && Boolean(formik.errors.body)}
            errorMessage={formik.errors.body}
          />

          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Detail;
