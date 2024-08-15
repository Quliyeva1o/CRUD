import * as Yup from "yup";

export const blogValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
  img: Yup.string().url("Invalid image URL"),
});

export const commentValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")
    .required("Email is required"),
  body: Yup.string().required("Comment is required"),
});
