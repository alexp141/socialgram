"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    if (error.message === "invalid claim: missing sub claim") {
      router.push("/login");
    }
  }, [error]);

  if (error.message === "invalid claim: missing sub claim") {
    <p className="text-emerald-500">redirecting...</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2>Something went wrong!</h2>
      <button
        className="text-blue-700 hover:underline"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
