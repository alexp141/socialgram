"use client";

import { signUpUser } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function LoginForm() {
  const [state, formAction] = useFormState(signUpUser, {
    message: "",
    error: null,
  });

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />
    </form>
  );
}
