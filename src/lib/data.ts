"use client";

import { createClient } from "@/utils/supabase/client";
import { PostRow } from "./types/type-collection";

export async function getPostLikes(postId: number) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("post_likes")
    .select("*", { count: "estimated", head: true })
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }

  if (count === null) {
    throw new Error("could not get like count");
  }

  return count;
}

export async function getLikeStatus(postId: number) {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("no session detected");
  }
  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { count, error } = await supabase
    .from("post_likes")
    .select("*", { count: "estimated", head: true })
    .eq("post_id", postId)
    .eq("user_id", session.user.id);

  if (error) {
    throw new Error(error.message);
  }

  if (count === null) {
    throw new Error("error getting like status");
  }

  if (count > 0) {
    return true;
  }
  return false;
}

export async function getPostFavorites(postId: number) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("favorites")
    .select("*", { count: "estimated", head: true })
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }

  if (count === null) {
    throw new Error("could not get favorites count");
  }

  return count;
}

export async function getFavoritedStatus(postId: number, userId: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("favorites")
    .select("*", { count: "estimated", head: true })
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  if (count === null) {
    throw new Error("error getting favorited status for post");
  }

  if (count > 0) {
    return true;
  }
  return false;
}

export async function getCommentCount(postId: number) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "estimated", head: true })
    .eq("reply_to_id", postId);

  if (error) {
    throw new Error(error.message);
  }

  if (count === null) {
    throw new Error("could not get comments count");
  }

  return count;
}

export async function getNextCommentsPage(
  currentPage: number,
  itemsPerPage: number,
  postId: number
) {
  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("reply_to_id", postId)
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const comments: PostRow[] = data;

  console.log("comments", comments);
  return comments;
}

export async function getUserPosts(
  currentPage: number,
  itemsPerPage: number,
  userId: string
) {
  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data;

  return posts;
}

export async function getUserId(username: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const userId: string = data.user_id;
  return userId;
}

export async function getUserFavorites(
  currentPage: number,
  itemsPerPage: number,
  username: string
) {
  const userId = await getUserId(username);

  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("favorites")
    .select(
      "posts(id,created_at,user_id,content,image_path,username,reply_to_id)"
    )
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data.map((res) => res.posts).flat();

  return posts;
}

export async function getUserFavoritesUsingId(
  currentPage: number,
  itemsPerPage: number,
  userId: string
) {
  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("favorites")
    .select(
      "posts(id,created_at,user_id,content,image_path,username,reply_to_id)"
    )
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data.map((res) => res.posts).flat();

  return posts;
}

export async function getUserLikes(
  currentPage: number,
  itemsPerPage: number,
  username: string
) {
  const userId = await getUserId(username);

  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("post_likes")
    .select(
      "posts(id,created_at,user_id,content,image_path,username,reply_to_id)"
    )
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data.map((res) => res.posts).flat();

  return posts;
}

export async function getNextPostsPage(
  currentPage: number,
  itemsPerPage: number
) {
  const supabase = createClient();

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .is("reply_to_id", null)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data;

  return posts;
}

export async function getAvatar(userid: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("user_id", userid)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.avatar_url as string | null;
}
