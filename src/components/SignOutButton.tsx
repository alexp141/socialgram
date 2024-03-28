"use client";

import { signOutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function SignOutButton({ style = "" }: { style?: string }) {
  const router = useRouter();

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await signOutUser();
    router.push("/login");
  }

  return (
    <div>
      <button type="button" onClick={handleClick} className={style}>
        Sign Out
      </button>
    </div>
  );
}
