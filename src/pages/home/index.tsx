import { useState } from "react";
import Button from "../../components/button";
import DeleteIcon from "../../assets/icons/deleteIcon";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from "../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import EditBlog from "./components/editBlog/index";
import AddBlog from "./components/addBlog";
import Input from "../../components/input";
import Modal from "../../components/modal";

const Home = () => {
  const { data: blogs = [], error, isLoading, refetch } = useGetAllBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  //STATES
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ visible: boolean; message: string; }>({ visible: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);

  // DELETE FUNCTION
  const handleDeleteBlog = async () => {
    if (deleteBlogId) {
      setLoading(true);
      try {
        await deleteBlog(deleteBlogId).unwrap();
        refetch();
        setDeleteBlogId(null);

        // NOTIFICATION
        setNotification({
          visible: true,
          message: "Blog deleted successfully!",
        });
        setLoading(false);
        setTimeout(() => {
          setNotification({ visible: false, message: "" });
        }, 3000);
      } catch (error) {
        setLoading(false);
        console.error("Failed to delete blog", error);
      }
    }
  };

  // SEARCH FUNCTIONS
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

  // LOADINGS & ERRORS
  if (error) return <p>Error fetching blogs. Please try again later.</p>;

  // COMPONENT
  return (
    <>
      <div className="container">
        <div className={styles.blog_heading}>
          <h3>Blogs</h3>
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
        </div>
        {loading || isLoading ? (
          <Loader />
        ) : (
          <div className={styles.blogs}>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.reverse().map(({ id, img, title }) => (
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
                      Edit
                    </Button>
                    <Link to={`blogs/${id}`}>
                      <Button size="small">Detail</Button>
                    </Link>
                    <Button
                      color="transparent"
                      size="small"
                      onClick={() => setDeleteBlogId(id)}
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
        )}
        {editPostId && (
          <EditBlog
            postId={editPostId}
            onClose={() => {
              setEditPostId(null);
              refetch();
            }}
          />
        )}
        <Modal
          isOpen={deleteBlogId ? true : false}
          onClose={() => setDeleteBlogId(null)}
          onConfirm={handleDeleteBlog}
          message="Are you sure you want to delete this blog?"
        />
        {notification.visible && (
          <div className={styles.notification}>{notification.message}</div>
        )}
      </div>
    </>
  );
};

export default Home;
