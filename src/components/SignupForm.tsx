"use client";

import { signUpUser } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

export default function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(signUpUser, {
    message: "",
    generalError: null,
    usernameError: null,
    emailError: null,
    passwordError: null,
  });

  //executes when user has signed up
  if (state.message === "success") {
    router.push("/home");
  }

  const formLabelStyle = "text-lg";
  const formInputStyle =
    "w-full border-2 border-gray-700 hover:border-sky-300 focus:outline-sky-300 rounded-lg bg-sky-900 text-xl p-1";

  return (
    <div className="sm:min-w-[30rem] bg-sky-500 p-6 flex flex-col border-2 border-sky-900 dark:border-sky-100 rounded-lg text-sky-50">
      <h2 className="text-4xl font-bold text-center">Sign Up</h2>
      <form action={formAction} className="flex flex-col my-4 gap-4">
        <div>
          <label htmlFor="username" className={formLabelStyle}>
            Username
          </label>
          <input
            type="username"
            name="username"
            id="username"
            required
            className={formInputStyle}
          />
          {state.usernameError && (
            <p className="text-red-700 font-semibold"> {state.usernameError}</p>
          )}
        </div>
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
          {state.emailError && (
            <p className="text-red-700 font-semibold"> {state.emailError}</p>
          )}
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
          {state.passwordError && (
            <p className="text-red-700 font-semibold"> {state.passwordError}</p>
          )}
        </div>
        <div className="self-center">
          <button
            type="submit"
            className="border-2 border-sky-100 text-sky-50 rounded-full py-2 px-4 bg-blue-800 text-lg"
          >
            Sign up
          </button>
        </div>
        {state.message && <p className="text-green-500"> {state.message}</p>}
        {state.generalError && (
          <p className="text-red-500"> {state.generalError}</p>
        )}
      </form>
      <p className="mt-6">
        Already have an account?{" "}
        <Link
          href={"/login"}
          className="hover:underline text-blue-950 hover:text-blue-100"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
