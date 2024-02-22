"use client";

import { signUpUser } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function SignupForm() {
  const [state, formAction] = useFormState(signUpUser, {
    message: "",
    error: null,
  });

  return (
    <form action={formAction}>
      <label htmlFor="username">Username</label>
      <input type="username" name="username" id="username" required />

      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" required />

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" required />

      <button type="submit" className="text-blue-500">
        submit
      </button>
      {state.message}
      {state.error}
    </form>
  );
}
