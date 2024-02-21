"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createPostReturn } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

export async function signUpUser(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let email = formData.get("email");
  let password = formData.get("password");
  if (!email || !password) {
    return { error: "email or password is null" };
  }

  email = email.toString();
  password = password.toString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

export async function getUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
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
  const {
    data,
    error,
  }: { data: createPostReturn[] | null; error: PostgrestError | null } =
    await supabase
      .from("posts")
      .insert([{ content, user_id, image_path: null }])
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log("image file", file);

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
    .update({ image_path: data.path })
    .eq("id", post_id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log("IMAGE PATH SUPABASE", data.path);
  return data.path;
}

export async function getNextPostsPage(
  currentPage: number,
  itemsPerPage: number
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .range(start, end);
  console.log("post data", data);
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function downloadPostImage(postId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.storage
    .from("post_images")
    .download("public/avatar1.png");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
