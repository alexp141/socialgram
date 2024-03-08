"use client";

import { useRef, useState } from "react";
import Modal from "./Modal";
import { createPost } from "@/lib/actions";
import Image from "next/image";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import ImageCropper from "./ImageCropper";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [image, setImage] = useState<string>("");

  const postInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

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
            />
          </Modal>
          <button>Post</button>
          {image && <Image src={image} width={200} height={200} alt="image" />}
        </form>
      </Modal>
    </div>
  );
}
