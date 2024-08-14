import * as Yup from "yup";

export const blogValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
  img: Yup.string().url("Invalid image URL").required("Image URL is required"),
});

export const commentValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  body: Yup.string().required("Comment is required"),
});
