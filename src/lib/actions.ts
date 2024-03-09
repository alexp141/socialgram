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
  UsersInsert,
  UsersRow,
  UsersUpdate,
} from "./types/type-collection";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

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

  const userData = data.user;
  if (!userData) {
    return { error: "user data not found" };
  }
  const { error: usersError } = await supabase
    .from("users")
    .insert({ user_id: userData.id, username, email });

  if (usersError) {
    return {
      message: "fail",
      error: usersError.message,
    };
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

export async function createPost(
  formData: FormData,
  replyToId: number | null = null
) {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    return { error: "user not found", message: null };
  }

  const userId = user.id;
  const username = user.user_metadata["username"];

  const content = formData.get("content") as FormDataEntryValue;

  if (!content) {
    return { error: "failed to get content from form", message: null };
  }

  const image = formData.get("postImage");

  //CREATE POST
  const { data, error } = await supabase
    .from("posts")
    .insert<PostInsert>({
      user_id: userId,
      content: content.toString(),
      image_path: null,
      username,
      reply_to_id: replyToId,
    })
    .select();

  if (error) {
    return { error: error.message, message: null };
  }

  if (!data || !data[0]) {
    return { error: "unable to fetch newly created post data", message: null };
  }

  if (!data[0].id) {
    return { error: "record id is undefined", message: null };
  }

  //UPLOAD IMAGE IF IT EXISTS
  const imageUrl = await uploadPostImage({
    file: image as File,
    user_id: userId,
    post_id: data[0].id,
  });

  return { message: "success", error: null };
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
  if (!file || !file.name || !file.size) {
    return;
  }

  const supabase = createClient();
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
    .is("reply_to_id", null)
    .order("created_at", { ascending: false })
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

export async function postComment(postId: number, formData: FormData) {
  const validation = commentSchema.safeParse({
    comment: formData.get("comment"),
    post_image: formData.get("post_image"),
  });

  if (!validation.success) {
    return { error: validation.error.message, message: "" };
  }

  const supabase = createClient();
  const userId = (await getUser()).id;

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

  console.log("asdf", data?.[0]?.favorites);
}

export async function uploadProfilePic(file: File, userId: string) {
  console.log("profile pic image file", file);

  if (!file.name || !file.size) {
    return;
  }

  const fileExtension = file.name.split(".")[1];
  // no validation required since it was already done
  // Upload file using standard upload
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("profile")
    .upload(`${userId}/profile_picture/profile-pic.${fileExtension}`, file, {
      contentType: "image/*",
      upsert: true,
    });

  if (error) {
    // Handle error
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("image data is null");
  }

  //updating path to avatar
  const { error: updateError } = await supabase
    .from("users")
    .update<UsersUpdate>({
      avatar_url: `${userId}/profile_picture/profile-pic.${fileExtension}`,
    })
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log("PROFILE PIC IMAGE PATH SUPABASE", data.path);
  return data.path;
}

export async function uploadProfileBanner(file: File, userId: string) {
  //no validation required
  const supabase = createClient();

  console.log("banner file", file);

  if (!file.name || !file.size) {
    return;
  }

  const fileExtension = file.name.split(".")[1];

  // Upload file using standard upload
  const { data, error } = await supabase.storage
    .from("profile")
    .upload(`${userId}/banner/banner.${fileExtension}`, file, {
      contentType: "image/*",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("image data is null");
  }

  const { error: updateError } = await supabase
    .from("users")
    .update<UsersUpdate>({
      banner_url: `${userId}/banner/banner.${fileExtension}`,
    })
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log("BANNER PIC IMAGE PATH SUPABASE", data.path);
  return data.path;
}

const profileDataSchema = z.object({
  banner: z
    .any()
    .refine(
      (file) => {
        console.log("banner file in data schema", file);
        return file?.size >= MAX_FILE_SIZE ? false : true;
      },
      { message: "file size must be less than 10MB" }
    )
    .refine(
      (file) => {
        return (
          ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type) || file?.size === 0
        );
      },
      { message: "only jpg, png and webp images are allowed" }
    ),
  profileImage: z
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
          ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type) || file?.size === 0
        );
      },
      { message: "only jpg, png and webp images are allowed" }
    ),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  birthday: z.string().refine((str) => {
    if (typeof str === "string" || str === "") return true;
    return false;
  }),
});

export async function updateProfile(
  userId: string,
  username: string,
  formData: FormData
) {
  const validation = profileDataSchema.safeParse({
    banner: formData.get("banner"),
    profileImage: formData.get("profileImage"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    website: formData.get("website"),
    birthday: formData.get("birthday"),
  });

  if (!validation.success) {
    // console.error(validation.error.message);
    return { error: validation.error.message };
  }

  const {
    profileImage,
    banner,
    bio,
    birthday,
    location,
    website,
    firstName,
    lastName,
  } = validation.data;

  const supabase = createClient();

  const { error } = await supabase
    .from("users")
    .update<UsersUpdate>({
      bio,
      birthday: birthday || null,
      location,
      website,
      first_name: firstName,
      last_name: lastName,
    })
    .eq("user_id", userId);

  if (error) {
    console.log(error.message);
    return { error: error.message };
  }

  //update profile picture
  try {
    const pfPath = await uploadProfilePic(profileImage as File, userId);
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
  }

  //update banner picture
  try {
    const pfPath = await uploadProfileBanner(banner as File, userId);
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
  }

  revalidatePath(`/${username}`);
  return { message: "success" };
}

export async function getProfileData(username: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "created_at, user_id, username, bio, birthday, location, avatar_url, banner_url"
    )
    .eq("username", username)
    .single();
  if (error) {
    return { data: null, error: error.message };
  }

  const profileData = data;

  return { data: profileData, error: null };
}
