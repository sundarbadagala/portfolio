export interface IInitialState {
  data: string[];
  isLoading: boolean;
  error: string;
}

export interface IResponse {
  data: string[];
  message: string;
  status: string;
  statusCode: number;
  statusText: string;
}

export interface IBlogCardProps {
  content: string;
  date: Date;
  tags: string[];
  title: string;
  _id: string;
  highlight: string;
  headlines: string;
  slug: string;
  content_id: string;
}



export interface INewsCardProps {
  title: string;
  source: {
    name: string;
  };
  image: string;
  publishedAt: Date;
  url: string;
}
