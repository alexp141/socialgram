"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import {
  CommentsInsert,
  CommentsRow,
  CommentsUpdate,
  FavoritesInsert,
  FollowersInsert,
  PostInsert,
  PostLikesInsert,
  PostRow,
  PostUpdate,
  UsersInsert,
  UsersRow,
  UsersUpdate,
} from "./types/type-collection";
import { revalidatePath } from "next/cache";

const signupSchema = z.object({
  username: z.string().max(20, "usernames can be a max of 20 characters"),
  email: z.string().email(),
  password: z.string(),
});

export async function signUpUser(prevState: any, formData: FormData) {
  const validationResults = signupSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResults.success) {
    const errors = validationResults.error.format();
    console.log(validationResults.error.format());
    const usernameError = errors.username?._errors.join(" | ");
    const emailError = errors.email?._errors.join(" | ");
    const passwordError = errors.password?._errors.join(" | ");
    return {
      generalError: null,
      usernameError,
      emailError,
      passwordError,
    };
  }

  const supabase = createClient();

  const { username, email, password } = validationResults.data;

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
    return { generalError: error.message };
  }

  const userData = data.user;

  if (!userData) {
    return { generalError: "user data not found" };
  }
  const { data: usersInsertData, error: usersError } = await supabase
    .from("users")
    .insert({ user_id: userData.id, username, email })
    .select();

  console.log("USERS INSERTED DATA", usersInsertData);

  if (usersError) {
    return {
      message: "failure",
      generalError: usersError.message,
      usernameError: null,
      emailError: null,
      passwordError: null,
    };
  }
  return {
    message: "success",
    generalError: null,
    usernameError: null,
    emailError: null,
    passwordError: null,
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

  const image = formData.get("postImage") as File;

  if (!content && image.size === 0) {
    return { error: "cannot create post with no content", message: null };
  }

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

export async function likePost(postId: number) {
  const supabase = createClient();
  const userId = (await getUser()).id;
  const { error } = await supabase
    .from("post_likes")
    .insert<PostLikesInsert>({ post_id: postId, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unlikePost(postId: number) {
  const supabase = createClient();
  const userId = (await getUser()).id;

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function favoritePost(postId: number, loggedInUserId?: string) {
  const supabase = createClient();

  if (!loggedInUserId) {
    loggedInUserId = (await getUser()).id;
  }

  const { error } = await supabase
    .from("favorites")
    .insert<FavoritesInsert>({ post_id: postId, user_id: loggedInUserId });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unfavoritePost(postId: number, loggedInUserId?: string) {
  const supabase = createClient();

  if (!loggedInUserId) {
    loggedInUserId = (await getUser()).id;
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", loggedInUserId)
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

export async function getPost(postId: number) {
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
}

export async function uploadProfilePic(file: File, userId: string) {
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

  return data.path;
}

export async function uploadProfileBanner(file: File, userId: string) {
  //no validation required
  const supabase = createClient();

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

  return data.path;
}

const profileDataSchema = z.object({
  banner: z
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
    console.error(error.message);
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
    const pbPath = await uploadProfileBanner(banner as File, userId);
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
      "created_at, user_id, username, bio, birthday, location, avatar_url, banner_url, first_name, last_name, website"
    )
    .eq("username", username)
    .single();
  if (error) {
    return { data: null, error: error.message };
  }

  const profileData = data;

  return { data: profileData, error: null };
}

//checks how many users are following userId
export async function getFollowerCount(userId: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("followers")
    .select("*", { head: true, count: "estimated" })
    .eq("following", userId);

  if (error) {
    return { count: null, error: error.message };
  }

  return { count, error: null };
}

//gets the count of how many users the userId is following
export async function getFollowingCount(userId: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("followers")
    .select("*", { head: true, count: "estimated" })
    .eq("follower", userId);

  if (error) {
    return { count: null, error: error.message };
  }

  return { count, error: null };
}

export async function getUserId(username: string | undefined | null) {
  if (!username) {
    return "";
  }
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .single();

  console.log("getUserId username", username);
  if (error) {
    throw new Error(error.message);
  }

  const userId: string = data.user_id;
  return userId;
}

export async function followUser(userToFollow: string) {
  const supabase = createClient();
  const userId = (await getUser()).id;

  //check if already following
  const { count, error: isFollowingError } = await supabase
    .from("followers")
    .select("*", { head: true, count: "estimated" })
    .eq("follower", userId)
    .eq("following", userToFollow);

  if (isFollowingError) {
    return { error: isFollowingError.message };
  } else if (count && count > 0) {
    return { error: "You already follow this user" };
  }

  const { error } = await supabase.from("followers").insert<FollowersInsert>({
    follower: userId,
    following: userToFollow,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function unfollowUser(userToUnfollow: string) {
  const supabase = createClient();
  const userId = (await getUser()).id;

  const { count, error: isFollowingError } = await supabase
    .from("followers")
    .select("*", { head: true, count: "estimated" })
    .eq("follower", userId)
    .eq("following", userToUnfollow);

  if (isFollowingError) {
    return { error: isFollowingError.message };
  } else if (count && count === 0) {
    return { error: "You do not follow this user" };
  }

  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("follower", userId)
    .eq("following", userToUnfollow);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function getAvatar(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.avatar_url as string | null;
}

export async function getFollowableUsers(loggedInUserId?: string) {
  console.log("getFollowableUsers() executed");
  const supabase = createClient();

  if (!loggedInUserId) {
    loggedInUserId = (await getUser()).id;
  }

  const { data, error } = await supabase.rpc("getFollowableUsers", {
    userid: loggedInUserId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
