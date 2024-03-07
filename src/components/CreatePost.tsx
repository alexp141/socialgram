"use client";

import { useState } from "react";
import Modal from "./Modal";
import { createPost } from "@/lib/actions";
import Image from "next/image";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const queryClient = useQueryClient();

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("target", e.target.files);
    const imageUrl = URL.createObjectURL(e.target.files?.[0]!);
    console.log(imageUrl);
    setImage(imageUrl);
  }

  async function handleSubmit(formData: FormData) {
    const res = await createPost(formData);
    if (res.error) {
      toast.error(res.error);
      return;
    }

    //invalidate the feed from /userid
    queryClient.invalidateQueries({ queryKey: ["user-posts"] });

    toast.success("Successfully Submitted Post");
    setIsOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create Post
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Create New Post">
        <form action={handleSubmit}>
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
    </div>
  );
}
