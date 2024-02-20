import { PostgrestError, createClient } from "@supabase/supabase-js";
import { createPostReturn } from "../types";

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_API_KEY as string
);

export async function getLocalSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }
  console.log("session", data.session);

  if (!data.session) {
    throw new Error("no session detected!");
  }
  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error("UNABLE TO FETCH USER DATA");
  }

  return data.user;
}

export async function signUpNewUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  console.log("login successful");
  return data;
}

export interface createNewPostProps {
  content?: string;
  image?: FormDataEntryValue | null;
}

export async function createNewPost({ content, image }: createNewPostProps) {
  const user_id = (await getLocalSession()).user.id;

  //CREATE POST
  const {
    data,
    error,
  }: { data: createPostReturn[] | null; error: PostgrestError | null } =
    await supabase
      .from("posts")
      .insert([{ content, user_id, imagePath: null }])
      .select();

  if (!data || !data[0]) {
    throw new Error("unable to fetch data");
  }

  if (!data[0].id) {
    throw new Error("record id is undefined");
  }

  if (error) {
    throw new Error(error.message);
  }

  //UPLOAD IMAGE
  const imageUrl = await uploadPostImage({
    file: image as File,
    user_id,
    post_id: data[0].id,
  });
  console.log("image URL", imageUrl);

  return data;
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
  console.log("image file", file);

  if (!file.name || !file.size) {
    return;
  }

  // Upload file using standard upload
  const { data, error } = await supabase.storage
    .from("post_images")
    .upload(`${user_id}/posts/${String(post_id)}/${file.name}`, file, {
      contentType: "image/*",
    });
  if (error) {
    // Handle error
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("image data is null");
  }
  console.log("IMAGE PATH SUPABASE", data.path);
  return data.path;
}

export async function downloadPostImage(postId: string) {
  const { data, error } = await supabase.storage
    .from("avatars")
    .download("public/avatar1.png");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getNextPostsPage(
  currentPage: number,
  itemsPerPage: number
) {
  const start = currentPage * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage - 1;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
