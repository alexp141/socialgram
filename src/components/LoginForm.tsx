"use client";

import { emailLogin } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

export default function LoginForm() {
  const [state, formAction] = useFormState(emailLogin, {
    message: "",
    generalError: null,
    emailError: null,
    passwordError: null,
  });
  const router = useRouter();
  async function submitHandler(formData: FormData) {
    const res = await emailLogin(state, formData);
    if (res.message === "success") {
      router.push("/home");
    }
  }

  return (
    <form action={submitHandler}>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" required />
      {state.emailError && <p>{state.emailError}</p>}
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" required />
      {state.passwordError && <p>{state.passwordError}</p>}
      <button type="submit">Login</button>
      {state.message}
    </form>
  );
}
