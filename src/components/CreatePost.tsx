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
        <form action={handleSubmit} className=" bg-gray-950">
          <textarea
            name="content"
            placeholder="What's on your mind?"
            className="min-w-[32rem] min-h-32 bg-gray-950 outline-blue-800 p-2 my-4"
          />
          {image && <Image src={image} width={200} height={200} alt="image" />}
          <input type="file" name="postImage" hidden ref={postInputRef} />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="border border-sky-100 rounded-full bg-blue-800 px-4 py-2"
              onClick={() => setIsImageCropperOpen(true)}
            >
              {!image ? "Upload Image" : "Replace Image"}
            </button>
            {image && (
              <button
                type="button"
                className="border border-sky-100 rounded-full bg-red-800 px-4 py-2"
                onClick={() => setImage("")}
              >
                Clear Image
              </button>
            )}
            <button className="border border-sky-100 rounded-full bg-blue-800 px-4 py-2">
              Post
            </button>
          </div>

          <Modal
            isOpen={isImageCropperOpen}
            setIsOpen={setIsImageCropperOpen}
            title="Edit Post Image"
          >
            <ImageCropper
              cropAspectRatio={1}
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
        </form>
      </Modal>
    </div>
  );
}
