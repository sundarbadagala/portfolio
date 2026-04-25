export interface Blog {
  content_id: string;
  slug: string;
  user: string;
  username: string;
  content: string;
  headlines: string;
  title: string;
  tags: string[];
  date: string;
}

export interface BlogsResponse {
  status: string;
  message: string;
  data: Blog[];
}
