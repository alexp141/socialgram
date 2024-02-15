"use client";

import { emailLogin } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function LoginForm() {
  const [state, formAction] = useFormState(emailLogin, {
    message: "",
    error: null,
  });

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
      {state.error}
      {state.message}
    </form>
  );
}
