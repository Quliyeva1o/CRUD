import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setBlogs } from "../store/slices/blogsSlice";
import { useGetAllBlogsQuery } from "../store/slices/apiService";

const createSearchRegex = (query: string) => {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escapedQuery, "i");
};

const useBlogs = () => {
  const { data: myBlogs = [], refetch } = useGetAllBlogsQuery();
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Array<{ id: string; img?: string; title: string; body: string }>>([]);

  useEffect(() => {
    const regex = createSearchRegex(searchQuery);
    const filtered = blogs.filter(blog => regex.test(blog.title) || regex.test(blog.body));
    setFilteredBlogs(filtered.reverse());
  }, [searchQuery, blogs]);

  useEffect(() => {
    refetch()
  }, [])


  useEffect(() => {
    if (JSON.stringify(myBlogs) !== JSON.stringify(blogs)) {
      dispatch(setBlogs(myBlogs));
    }
  }, [myBlogs, dispatch]);

  return {
    searchQuery,
    setSearchQuery,
    filteredBlogs,
  };
};

export default useBlogs;
