"use client";

import { signOutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await signOutUser();
    router.push("/login");
  }

  return (
    <button type="button" onClick={handleClick}>
      Sign Out
    </button>
  );
}
