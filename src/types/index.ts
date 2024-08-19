export interface BlogFormValues {
  title: string;
  body: string;
  img: string;
  id?:string
}

export interface CommentValues {
  name: string;
  email: string;
  body: string;
}
// Initial state
export interface Comment {
  email: string;
  id: number;
  name: string;
  body: string;
  postId: string;
}

export interface Blog {
  comments?: Comment[];
  id: string;
  title: string;
  body: string;
  img?: string;
}