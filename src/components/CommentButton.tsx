"use client";

import { useState } from "react";
import { FaRegComment } from "react-icons/fa6";
import Modal from "./Modal";
import { postComment } from "@/lib/actions";
import Image from "next/image";
import { toast } from "react-toastify";
import useCommentCount from "@/hooks/useCommentCount";

export default function CommentButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const { commentCount, error, fetchStatus } = useCommentCount(postId);

  async function handleAction(formData: FormData) {
    const res = await postComment(postId, formData);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Comment posted");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("target", e.target.files);
    const imageUrl = URL.createObjectURL(e.target.files?.[0]!);
    console.log(imageUrl);
    setImage(imageUrl);
  }

  if (error) {
    <p>error loading comment data</p>;
  }

  return (
    <div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <FaRegComment />
        </button>
        <span>{commentCount}</span>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Replying to: @name">
        <form action={handleAction}>
          <textarea
            name="comment"
            placeholder="Replying to @name"
            className="w-full"
          />
          {image && <Image src={image} width={200} height={200} alt="image" />}
          <label htmlFor="post_image">upload image</label>
          <input
            type="file"
            name="post_image"
            id="post_image"
            onChange={handleImageUpload}
          />
          <button>Post</button>
        </form>
      </Modal>
    </div>
  );
}
