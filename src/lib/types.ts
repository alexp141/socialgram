export type createPostReturn = {
  id: number | undefined;
  created_at: string;
  contents: string | null;
  image: string | null;
  user_id: string;
};

export type SearchParams = { [key: string]: string | undefined };
