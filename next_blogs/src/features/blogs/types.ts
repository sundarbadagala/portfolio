export interface Tag {
  value: string;
  label: string;
}

export interface Blog {
  content_id: string;
  slug: string;
  user: string;
  username: string;
  content: string;
  headlines: string;
  title: string;
  tags: Tag[] | string[];
  date: string;
}

export interface BlogsResponse {
  status: string;
  message: string;
  data: Blog[];
}

export interface BlogResponse {
  status: string;
  message: string;
  data: Blog;
}
