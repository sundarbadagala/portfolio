export interface IBlogCardProps {
  title: string;
  content: string;
  tags: string[];
  date: Date;
  onClick: (arg1: string, arg2: string) => void;
  highlight: string;
  headlines: string;
  slug: string;
  content_id: string;

}
