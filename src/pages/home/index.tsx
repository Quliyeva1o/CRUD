import { useEffect, useState } from "react";
import Button from "../../components/button";
import DeleteIcon from "../../assets/icons/deleteIcon";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import {useGetAllBlogsQuery,useDeleteBlogMutation} from "../../redux/slices/apiSlice";
import styles from "./index.module.scss";
import EditBlog from "./components/editBlog/index";
import AddBlog from "./components/addBlog";
import Input from "../../components/input";
import Modal from "../../components/modal";
import { setBlogs } from "../../redux/slices/blogsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Home = () => {
  const { data: myBlogs = [], error, isLoading } = useGetAllBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();

  // STATES
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Array<{ id: string; img?: string; title: string; body: string }>>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ visible: boolean;message: string;}>({ visible: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);

  // DELETE FUNCTION
  const handleDeleteBlog = async () => {
    if (deleteBlogId) {
      setLoading(true);
      try {
        await deleteBlog(deleteBlogId).unwrap();
        dispatch(setBlogs(blogs.filter((blog) => blog.id !== deleteBlogId)));
        setNotification({
          visible: true,
          message: "Blog deleted successfully!",
        });
      } catch (error) {
        console.error("Failed to delete blog", error);
      } finally {
        setDeleteBlogId(null);

        setLoading(false);
      }
    }
  };

  // SEARCH FUNCTION TO FILTER BLOGS
  useEffect(() => {
    const getRegex = (query: string) => {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(escapedQuery, "i");
    };

    const regex = getRegex(searchQuery);
    const filtered = blogs.filter(
      (blog) => regex.test(blog.title) || regex.test(blog.body)
    );

    setFilteredBlogs(filtered.reverse());
  }, [searchQuery, blogs]);

  // EFFECT HOOK TO UPDATE BLOGS
  useEffect(() => {
    if (JSON.stringify(myBlogs) !== JSON.stringify(blogs)) {
      dispatch(setBlogs(myBlogs));
    }
  }, [myBlogs]);

  // LOADINGS & ERRORS
  if (error) return <p>Error fetching blogs. Please try again later.</p>;

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
            onClose={() => setEditPostId(null)}
            onUpdate={(updatedBlog) => {
              dispatch(
                setBlogs(
                  blogs.map((blog) =>
                    blog.id === updatedBlog.id ? updatedBlog : blog
                  )
                )
              );
            }}
          />
        )}
        <Modal
          isOpen={Boolean(deleteBlogId)}
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
