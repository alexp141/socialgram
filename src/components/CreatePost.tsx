"use client";

import { useState } from "react";
import Modal from "./Modal";

export default function CreatePost() {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create Post
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Create New Post">
        <p>test</p>
      </Modal>
    </>
  );
}
