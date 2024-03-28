"use client";

import { emailLogin } from "@/lib/actions";
import Link from "next/link";
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

  const formLabelStyle = "text-lg";
  const formInputStyle =
    "w-full border-2 border-gray-700 hover:border-sky-300 focus:outline-sky-300 rounded-lg bg-sky-900 text-xl p-1";
  return (
    <div className="sm:min-w-[30rem] bg-sky-500 p-6 flex flex-col border-2 border-sky-900 dark:border-sky-100 rounded-lg text-sky-50">
      <h2 className="text-4xl font-bold text-center">Login</h2>
      <form action={submitHandler} className="flex flex-col my-4 gap-4">
        <div>
          <label htmlFor="email" className={formLabelStyle}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className={formInputStyle}
          />
          {state.emailError && <p>{state.emailError}</p>}
        </div>
        <div>
          <label htmlFor="password" className={formLabelStyle}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className={formInputStyle}
          />
          {state.passwordError && <p>{state.passwordError}</p>}
        </div>
        <div className="self-center">
          <button
            type="submit"
            className="border-2 border-sky-100 text-sky-50 rounded-full py-2 px-4 bg-blue-800 text-lg"
          >
            Login
          </button>
        </div>
        {state.message}
      </form>
      <p className="mt-6">
        {"Don't have an account? "}
        <Link
          href={"/signup"}
          className="hover:underline text-blue-950 hover:text-blue-100"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
