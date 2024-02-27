import { useState } from "react";
import { FaRegComment } from "react-icons/fa6";
import Modal from "./Modal";
import { postComment } from "@/lib/actions";
import { useFormState } from "react-dom";
import Image from "next/image";

export default function CommentButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  //adding extra arguments to the formstate action
  const enhancedAction = postComment.bind(null, postId, userId);

  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const [formState, formAction] = useFormState(enhancedAction, { message: "" });

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("target", e.target.files);
    const imageUrl = URL.createObjectURL(e.target.files?.[0]!);
    console.log(imageUrl);
    setImage(imageUrl);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FaRegComment />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Replying to: @name">
        <form action={formAction}>
          <textarea
            name="content"
            placeholder="what's on your mind?"
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
