import blogsReducer from "@/components/blogs/slice.blogs";
import tagsReduce from "@/components/blogs/slice.tags";
import blogReducer from "@/components/blog/slice.blog";
import loginReducer from '@/components/login/slice.login'
import newsReducer from '@/components/blogs/slice.news'
import _blogsReduce from '@/components/dashboard/slice.blogs'

export const rootReducer = {
  blogs: blogsReducer,
  tags: tagsReduce,
  blog: blogReducer,
  login: loginReducer,
  news: newsReducer,
  _blogs: _blogsReduce
};
