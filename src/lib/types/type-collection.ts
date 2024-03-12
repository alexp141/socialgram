import { Database } from "./supabase";

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type Post = Omit<PostRow, "image_path"> & { imageFile: File };

export type PostLikesRow = Database["public"]["Tables"]["post_likes"]["Row"];
export type PostLikesInsert =
  Database["public"]["Tables"]["post_likes"]["Insert"];
export type PostLikesUpdate =
  Database["public"]["Tables"]["post_likes"]["Update"];

export type FavoritesRow = Database["public"]["Tables"]["favorites"]["Row"];
export type FavoritesInsert =
  Database["public"]["Tables"]["favorites"]["Insert"];
export type FavoritesUpdate =
  Database["public"]["Tables"]["favorites"]["Update"];

export type CommentsRow = Database["public"]["Tables"]["comments"]["Row"];
export type CommentsInsert = Database["public"]["Tables"]["comments"]["Insert"];
export type CommentsUpdate = Database["public"]["Tables"]["comments"]["Update"];

export type UsersUpdate = Database["public"]["Tables"]["users"]["Update"];
export type UsersRow = Database["public"]["Tables"]["users"]["Row"];
export type UsersInsert = Database["public"]["Tables"]["users"]["Insert"];

export type FollowersRow = Database["public"]["Tables"]["followers"]["Row"];
export type FollowersUpdate =
  Database["public"]["Tables"]["followers"]["Update"];
export type FollowersInsert =
  Database["public"]["Tables"]["followers"]["Insert"];

export type UserCardType = Pick<
  UsersRow,
  "user_id" | "username" | "avatar_url" | "bio"
>;
