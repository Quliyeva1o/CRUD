import { useState } from "react";
import Button from "../../../../components/button";
import DeleteIcon from "../../../../components/deleteIcon";
import Loader from "../../../../components/loader";
import { Link } from "react-router-dom";
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from "../../../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import EditBlog from "../editBlog/index";
import AddBlog from "../addBlog";
import Input from "../../../../components/input";

const Blogs = () => {
  const { data: blogs = [], error, isLoading, refetch } = useGetAllBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDeleteBlog = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete blog", error);
        alert("Failed to delete the blog. Please try again.");
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title
        .trim()
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()) ||
      blog.body.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching blogs. Please try again later.</p>;

  return (
    <>
      <div className="container">
        <div className={styles.filters}>
          <Input
            type="text"
            name="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Blog"
          />
          <AddBlog />
        </div>
        <div className={styles.blogs}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(({ id, img, title }) => (
              <div key={id} className={styles.blog_card}>
                <img
                  src={
                    img
                      ? img
                      : "https://i.pinimg.com/236x/97/43/ec/9743ecac80966a95e9d328c08b995c04.jpg"
                  }
                  alt={`Blog titled ${title}`}
                />
                <h1>{title}</h1>
                <div className={styles.card_btns}>
                  <Button size="small" onClick={() => setEditPostId(id)}>
                    Rədaktə et
                  </Button>
                  <Button size="small">
                    <Link to={`blogs/${id}`}>Detail</Link>
                  </Button>
                  <Button
                    color="transparent"
                    size="small"
                    onClick={() => handleDeleteBlog(id)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
        {editPostId && (
          <EditBlog
            postId={editPostId}
            onClose={() => {
              setEditPostId(null);
              refetch();
            }}
          />
        )}
      </div>
    </>
  );
};

export default Blogs;
