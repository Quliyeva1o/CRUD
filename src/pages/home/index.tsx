import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../common/ui/button";
import DeleteIcon from "../../assets/icons/deleteIcon";
import Loader from "../../common/ui/loader";
import Input from "../../common/ui/input";
import Modal from "../../common/ui/modal";
import EditBlog from "./components/editBlog/index";
import AddBlog from "./components/addBlog";
import useBlogs from "../../hooks/useBlogs";
import useDeleteBlog from "../../hooks/useDeleteBlog";
import styles from "./index.module.scss";

const Home = () => {
  // CUSTOM HOOKS
  const { searchQuery, setSearchQuery, filteredBlogs, isLoading, error } = useBlogs();
  const { deleteBlogId, setDeleteBlogId, handleDeleteBlog, loading: deleteLoading } = useDeleteBlog();

  //STATES
  const [editPostId, setEditPostId] = useState<string | null>(null);

  //ERROR
  if (error) return <p>Error fetching blogs. Please try again later.</p>;

  return (
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
      {isLoading || deleteLoading ? (
        <Loader />
      ) : (
        <div className={styles.blogs}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(({ id, img, title }) => (
              <div key={id} className={styles.blog_card}>
                <img
                  src={img || "https://i.pinimg.com/736x/9d/2b/bc/9d2bbc6b0d78d00f4ef6ad4dae7aa7ec.jpg"}
                  alt={`Blog titled ${title}`}
                />
                <div className={styles.textContent}>
                  <h1>{title}</h1>
                  <div className={styles.card_btns}>
                    <Button size="small" onClick={() => setEditPostId(id)}>Edit</Button>
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
        />
      )}
      {deleteBlogId && (
        <Modal show={Boolean(deleteBlogId)} onClose={() => setDeleteBlogId(null)}>
          <p className={styles.modalText}>Are you sure you want to delete this blog?</p>
          <div className={styles.modalActions}>
            <Button onClick={handleDeleteBlog}>Yes</Button>
            <Button onClick={() => setDeleteBlogId(null)}>No</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
