"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import {
  CommentsInsert,
  CommentsRow,
  CommentsUpdate,
  FavoritesInsert,
  PostInsert,
  PostLikesInsert,
  PostRow,
  PostUpdate,
} from "./types/type-collection";

export async function signUpUser(prevState: any, formData: FormData) {
  const supabase = createClient();

  let email = formData.get("email");
  let password = formData.get("password");
  let username = formData.get("username");

  if (!email || !password) {
    return { error: "email or password is null" };
  }

  if (!username) {
    return { error: "user name is null" };
  }

  email = email.toString();
  password = password.toString();
  username = username.toString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        email,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "success",
    error: null,
  };
}

export async function emailLogin(prevState: any, formData: FormData) {
  const supabase = createClient();

  let email = formData.get("email");
  let password = formData.get("password");
  if (!email || !password) {
    return {
      message: "",
      generalError: "email or password is null",
      emailError: null,
      passwordError: null,
    };
  }

  email = email.toString();
  password = password.toString();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: "",
      generalError: error,
      emailError: null,
      passwordError: null,
    };
  }

  return {
    message: "success",
    generalError: null,
    emailError: null,
    passwordError: null,
  };
}

export async function signOutUser() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("UNABLE TO FETCH USER DATA");
  }

  return data.user;
}

export async function createPost(prevState: any, formData: FormData) {
  const supabase = createClient();

  const user_id = (await supabase.auth.getUser()).data.user?.id;

  if (!user_id) {
    throw new Error("user id not found");
  }

  const content = formData.get("content") as FormDataEntryValue;

  if (!content) {
    return {};
  }

  const image = formData.get("post_image");

  //CREATE POST
  const { data, error } = await supabase
    .from("posts")
    .insert<PostInsert>({
      user_id,
      content: content.toString(),
      image_path: null,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data[0]) {
    throw new Error("unable to fetch data");
  }

  if (!data[0].id) {
    throw new Error("record id is undefined");
  }

  const postData: PostRow[] = data;

  //UPLOAD IMAGE IF IT EXISTS
  const imageUrl = await uploadPostImage({
    file: image as File,
    user_id,
    post_id: data[0].id,
  });

  return { message: "success" };
}

export async function uploadPostImage({
  file,
  user_id,
  post_id,
}: {
  file: File;
  user_id: string;
  post_id: number;
}) {
  const supabase = createClient();

  if (!file.name || !file.size) {
    return;
  }

  const fileExtension = file.name.split(".")[1];

  // Upload file using standard upload
  const { data, error } = await supabase.storage
    .from("post_images")
    .upload(
      `${user_id}/posts/${String(post_id)}/post-image.${fileExtension}`,
      file,
      {
        contentType: "image/*",
      }
    );

  if (error) {
    // Handle error
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("image data is null");
  }

  //UPDATE IMAGE URL IN POSTS TABLE
  const { error: updateError } = await supabase
    .from("posts")
    .update<PostUpdate>({ image_path: data.path })
    .eq("id", post_id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return data.path;
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
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const posts: PostRow[] = data;

  return posts;
}

export async function downloadPostImage(imagePath: string) {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("post_images")
    .download(`${imagePath}`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function likePost(postId: number, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("post_likes")
    .insert<PostLikesInsert>({ post_id: postId, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unlikePost(postId: number, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function favoritePost(postId: number, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("favorites")
    .insert<FavoritesInsert>({ post_id: postId, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unfavoritePost(postId: number, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }
}
const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const commentSchema = z.object({
  comment: z.string().optional(),
  post_image: z
    .any()
    .refine(
      (file) => {
        return file?.size >= MAX_FILE_SIZE ? false : true;
      },
      { message: "file size must be less than 10MB" }
    )
    .refine(
      (file) => {
        return (
          ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type) || file.size === 0
        );
      },
      { message: "only jpg, png and webp images are allowed" }
    )
    .optional(),
});

export async function postComment(
  postId: number,
  userId: string,
  formData: FormData
) {
  const validation = commentSchema.safeParse({
    comment: formData.get("comment"),
    post_image: formData.get("post_image"),
  });
  console.log("image file", formData.get("post_image"));
  if (!validation.success) {
    return { error: validation.error.message, message: "" };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert<CommentsInsert>({
      post_id: postId,
      user_id: userId,
      comment: validation.data.comment,
    })
    .select("*");

  if (error) {
    return { message: "", error: error.message };
  }
  const commentData: CommentsRow = data[0];

  const res = await uploadCommentImage(
    validation.data.post_image,
    postId,
    commentData.id,
    commentData.user_id
  );

  return { message: "success", error: null };
}

export async function uploadCommentImage(
  file: File,
  postId: number,
  commentId: number,
  commenterUserId: string
) {
  const supabase = createClient();

  console.log("image file", file);

  if (!file.name || !file.size) {
    return;
  }

  const fileExtension = file.name.split(".")[1];

  // Upload file using standard upload
  const { data, error } = await supabase.storage
    .from("comment_images")
    .upload(
      `${commenterUserId}/comments/${postId}/comments/${String(
        commentId
      )}/comment-image.${fileExtension}`,
      file,
      {
        contentType: "image/*",
      }
    );

  if (error) {
    // Handle error
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("image data is null");
  }

  //UPDATE IMAGE URL IN COMMENTS TABLE
  const { error: updateError } = await supabase
    .from("comments")
    .update<CommentsUpdate>({ image_path: data.path })
    .eq("id", commentId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log("COMMENT IMAGE PATH SUPABASE", data.path);
  return data.path;
}

export async function getPost(postId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const post: PostRow = data;

  return post;
}

export async function getPostInfo(postId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, created_at, content, image_path, user_id, favorites(*), comments(*), post_likes(*)"
    )
    .eq("id", postId);

  console.log(data);
  console.log("asdf", data?.[0]?.favorites);
}
