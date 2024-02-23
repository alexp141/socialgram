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
