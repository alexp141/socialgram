"use client";

import { createPost } from "@/lib/actions";
import { PostRow } from "@/lib/types/type-collection";
import { toast } from "react-toastify";
import Modal from "./Modal";
import ImageCropper from "./ImageCropper";
import { useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentCreator({ post }: { post: PostRow }) {
  const postInputRef = useRef<HTMLInputElement | null>(null);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [image, setImage] = useState<string>("");
  const queryClient = useQueryClient();

  async function handleAction(formData: FormData) {
    const res = await createPost(formData, post.id);

    if (res.error) {
      console.log(res.error);
      toast.error(res.error);
      return;
    }
    toast.success("Comment posted");

    queryClient.invalidateQueries({
      queryKey: ["comments", post.id],
    });
  }

  return (
    <div className="grid grid-cols-[auto_1fr] border-t border-red-500 py-2 px-1">
      <div className="">
        <div className="w-12 h-12 bg-orange-500 border rounded-full mx-1"></div>
      </div>
      <form action={handleAction}>
        <textarea
          onFocus={() => console.log("focused")}
          className="w-full min-h-24"
          placeholder="Post your reply"
          maxLength={300}
          name="content"
        />
        <input type="file" name="postImage" hidden ref={postInputRef} />
        <button
          type="button"
          className="border rounded-sm bg-orange-700"
          onClick={() => setIsImageCropperOpen(true)}
        >
          Upload Image
        </button>
        <Modal
          isOpen={isImageCropperOpen}
          setIsOpen={setIsImageCropperOpen}
          title="Edit Post Image"
        >
          <ImageCropper
            cropAspectRatio={0}
            cropMinimumWidth={100}
            fileName="post-image"
            inputName="postImage"
            setIsCropperOpen={setIsImageCropperOpen}
            updateImage={setImage}
            exteriorInputRef={postInputRef}
            circularCrop={false}
            isPostImage
          />
        </Modal>
        <button>Post</button>
        {image && <Image src={image} width={200} height={200} alt="image" />}
      </form>
    </div>
  );
}
