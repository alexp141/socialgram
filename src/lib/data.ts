import { createClient } from "@/utils/supabase/client";

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
