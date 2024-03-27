"use client";

import { FaCircleQuestion, FaUser } from "react-icons/fa6";
import Modal from "./Modal";
import { useState } from "react";
import Link from "next/link";
import ThemeButton from "./ThemeButton";

export default function MobileSettings({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const listStyle =
    "flex gap-2 items-center text-sky-50 px-4 py-2 border border-sky-100 bg-sky-500 rounded-full ";

  return (
    <div>
      <button>
        <FaCircleQuestion onClick={() => setIsOpen(true)} />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Other">
        <div className="flex flex-col justify-center items-center gap-2">
          <Link href={`/user/${username}`} className={listStyle}>
            {" "}
            <FaUser /> Profile
          </Link>
          <ThemeButton isListButton />
        </div>
      </Modal>
    </div>
  );
}
