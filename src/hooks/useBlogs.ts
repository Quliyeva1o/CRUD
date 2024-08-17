// hooks/useBlogs.ts
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setBlogs } from "../store/slices/blogsSlice";
import { useGetAllBlogsQuery } from "../store/slices/apiSlice";

const useBlogs = () => {
  const { data: myBlogs = [], error, isLoading, refetch } = useGetAllBlogsQuery();
  const { blogs } = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBlogs, setFilteredBlogs] = useState<Array<{ id: string; img?: string; title: string; body: string }>>([]);

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

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (JSON.stringify(myBlogs) !== JSON.stringify(blogs)) {
      dispatch(setBlogs(myBlogs));
    }
  }, [myBlogs, dispatch]);

  return {
    searchQuery,
    setSearchQuery,
    filteredBlogs,
    isLoading,
    error
  };
};

export default useBlogs;
