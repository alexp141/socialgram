"use client";

import { useRef, useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import ImageCropper from "./ImageCropper";
import { FaPenToSquare, FaRegComment } from "react-icons/fa6";
import SubmitButton from "./SubmitButton";
import usePostCreator from "@/hooks/usePostCreator";

export default function CreatePost({
  replyToId,
  displayAsCommentButton,
  displayAsSidebarButton,
}: {
  replyToId?: number;
  displayAsCommentButton?: boolean;
  displayAsSidebarButton?: boolean;
}) {
  const { createNewPost, createNewPostError, createNewPostStatus } =
    usePostCreator();

  const [isOpen, setIsOpen] = useState(false);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [image, setImage] = useState<string>("");

  const postInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(formData: FormData) {
    createNewPost(
      { formData, replyToId },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  }

  return (
    <div>
      {displayAsCommentButton && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <FaRegComment />
        </button>
      )}

      {displayAsSidebarButton && (
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <FaPenToSquare />
            <span className="hidden md:inline whitespace-nowrap">
              Create Post
            </span>
          </button>
        </div>
      )}

      {!displayAsSidebarButton && !displayAsCommentButton && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
          className={
            replyToId
              ? "px-4 py-2 border-2 rounded-full border-sky-50 hover:bg-sky-700 bg-sky-400 text-sky-50"
              : ""
          }
        >
          {replyToId ? (
            <span className="hidden md:inline">Reply</span>
          ) : (
            <span className="hidden md:inline">Create Post</span>
          )}
        </button>
      )}

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={replyToId ? "Create Reply" : "Create New Post"}
      >
        <form action={handleSubmit} className=" dark:bg-gray-950">
          <textarea
            name="content"
            placeholder="What's on your mind?"
            className="w-full sm:min-w-[32rem] min-h-32 dark:bg-gray-950 outline-sky-500 p-2 my-4"
          />
          {image && (
            <Image
              src={image}
              width={200}
              height={200}
              alt="image"
              className="border-2 border-sky-50 rounded-lg"
            />
          )}
          <input type="file" name="postImage" hidden ref={postInputRef} />

          <div className="flex justify-between mt-4 flex-col gap-2">
            <button
              type="button"
              className="border border-sky-100 rounded-full bg-sky-500 px-4 py-2"
              onClick={() => setIsImageCropperOpen(true)}
            >
              {!image ? "Upload Image" : "Replace Image"}
            </button>
            {image && (
              <button
                type="button"
                className="border border-sky-100 rounded-full bg-red-800 px-4 py-2 text-sky-50"
                onClick={() => setImage("")}
              >
                Clear Image
              </button>
            )}
            <button
              disabled={createNewPostStatus === "pending"}
              className="border border-sky-100 rounded-full bg-sky-500 px-4 py-2 text-sky-50"
            >
              {createNewPostStatus === "pending" ? (
                <span>Loading...</span>
              ) : (
                <span>Post</span>
              )}
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
