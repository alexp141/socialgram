"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useFormState } from "react-dom";
import { createPost } from "@/lib/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useFormState(createPost, {});
  const [image, setImage] = useState<null | string>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("target", e.target.files);
    const imageUrl = URL.createObjectURL(e.target.files?.[0]!);
    console.log(imageUrl);
    setImage(imageUrl);
  }

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
        <form action={formAction}>
          <textarea
            name="content"
            placeholder="what's on your mind?"
            className="w-full"
          />
          <label htmlFor="post_image">upload image</label>
          <input
            type="file"
            name="post_image"
            id="post_image"
            onChange={handleImageUpload}
          />
          <button>Post</button>
          {image && <Image src={image} width={200} height={200} alt="image" />}
        </form>
      </Modal>
    </>
  );
}
