"use server";

import { signInWithEmail, signUpNewUser } from "./supabase/supabaseApi";

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
    return { error: "email or password is null" };
  }

  email = email.toString();
  password = password.toString();

  try {
    const res = await signInWithEmail({ email, password });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "something went wrong while logging in",
    };
  }
  return {
    message: "success",
    error: null,
  };
}
