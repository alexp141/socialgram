import Link from "next/link";
import CreatePost from "./CreatePost";

export default function Sidebar() {
  return (
    <div className="justify-self-center">
      <div className="flex flex-col gap-4 text-lg font-semibold justify-self-center sticky top-0">
        <Link href="/home">Home</Link>
        <Link href="/favorites">Favorites</Link>
        <Link href="/about">About</Link>
        <CreatePost />
      </div>
    </div>
  );
}
