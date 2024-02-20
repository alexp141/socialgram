"use server";

import { redirect } from "next/navigation";
import {
  createNewPost,
  createNewPostProps,
  signInWithEmail,
  signUpNewUser,
} from "./supabase/supabaseApi";

export async function signUpUser(prevState: any, formData: FormData) {
  let email = formData.get("email");
  let password = formData.get("password");
  if (!email || !password) {
    return { error: "email or password is null" };
  }

  email = email.toString();
  password = password.toString();

  try {
    const res = await signUpNewUser({ email, password });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "something went wrong while signing up",
    };
  }
  return {
    message: "success",
    error: null,
  };
}

export async function emailLogin(prevState: any, formData: FormData) {
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

  try {
    const res = await signInWithEmail({ email, password });
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: "",
        generalError: error.message,
        emailError: null,
        passwordError: null,
      };
    }

    return {
      message: "",
      generalError: "something went wrong while signing in",
      emailError: null,
      passwordError: null,
    };
  }
  // console.log("redirecting");
  // redirect("/home");
  return {
    message: "success",
    generalError: null,
    emailError: null,
    passwordError: null,
  };
}

export async function createPost(prevState: any, formData: FormData) {
  const content = formData.get("content") as FormDataEntryValue;
  if (!content) {
    return {};
  }

  //console.log("CREATE NEW POST DATA", data);
  const image = formData.get("post_image") as File;

  const data = await createNewPost({
    content: content.toString(),
    image,
  });

  return {};
}
