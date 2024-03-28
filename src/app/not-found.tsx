import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-2">
      <h2 className="text-red-500">404 - Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/home" className="text-blue-500 hover:underline">
        Return Home
      </Link>

      <Link href="/login" className="text-blue-500 hover:underline">
        Go To Login Page
      </Link>
    </div>
  );
}
