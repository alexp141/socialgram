import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/home">Home</Link>
      <Link href="/favorites">Favorites</Link>
      <Link href="/post">Post</Link>
      <Link href="/about">About</Link>
    </div>
  );
}
