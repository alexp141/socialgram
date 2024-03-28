"use client";

import { FaEllipsis } from "react-icons/fa6";
import Modal from "./Modal";
import { useState } from "react";
import Link from "next/link";
import ThemeButton from "./ThemeButton";
import SignOutButton from "./SignOutButton";

export default function MobileSettings({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const listStyle =
    "flex gap-2 items-center text-sky-50 px-4 py-2 border-2 border-sky-100 bg-sky-500 rounded-full ";

  return (
    <div>
      <button>
        <FaEllipsis onClick={() => setIsOpen(true)} />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Other">
        <div className="flex flex-col justify-center items-center gap-2">
          <Link href={`/user/${username}`} className={listStyle}>
            {" "}
            Profile
          </Link>
          <ThemeButton isListButton />
          <SignOutButton style="px-4 py-2 border-2 rounded-full border-sky-50 hover:bg-sky-700 bg-sky-500 text-sky-50" />
        </div>
      </Modal>
    </div>
  );
}
