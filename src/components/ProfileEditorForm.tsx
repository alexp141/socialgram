"use client";

import { useRef, useState } from "react";
import Modal from "./Modal";
import { updateProfile } from "@/lib/actions";
import { toast } from "react-toastify";
import ImageCropper from "./ImageCropper";
import Image from "next/image";

export default function ProfileEditorForm({
  userId,
  username,
  initialProfilePic,
}: {
  userId: string;
  username: string;
  initialProfilePic: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(initialProfilePic);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  function handleClick() {
    setIsOpen(true);
  }

  async function handleAction(formData: FormData) {
    //upload form
    const res = await updateProfile(userId, username, formData);

    //toast message
    if (res.error) {
      console.log(res.error);
      toast.error(res.error);
      return;
    }

    toast.success("successfuly updated profile");
  }

  return (
    <>
      <button type="button" onClick={handleClick}>
        edit profile
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Edit Profile">
        <form action={handleAction}>
          <div>
            <div className="flex justify-between">
              <label htmlFor="bannerImage">Change banner</label>
              <input type="file" name="bannerImage" />
            </div>
            <div className="flex flex-col">
              <div className="my-12">
                <Image src={profilePic} width={200} height={200} alt="test" />
                <button
                  type="button"
                  className="border rounded-sm bg-orange-700"
                  onClick={() => setIsImageCropperOpen(true)}
                >
                  change Profile Pic
                </button>
                <input
                  type="file"
                  name="profileImage"
                  hidden
                  ref={avatarInputRef}
                />
                <Modal
                  isOpen={isImageCropperOpen}
                  setIsOpen={setIsImageCropperOpen}
                  title="Edit Profile"
                >
                  <ImageCropper
                    cropAspectRatio={1}
                    cropMinimumWidth={100}
                    fileName="profile-pic"
                    inputName="profileImage"
                    setIsImageCropperOpen={setIsImageCropperOpen}
                    setProfilePic={setProfilePic}
                    avatarInputRef={avatarInputRef}
                  />
                </Modal>
              </div>
              <label htmlFor="firstName">First Name</label>
              <input type="text" name="firstName" />

              <label htmlFor="lastName">Last Name</label>
              <input type="text" name="lastName" />

              <label htmlFor="bio">Bio</label>
              <input type="text" name="bio" />

              <label htmlFor="location">Location</label>
              <input type="text" name="location" />

              <label htmlFor="website">Website</label>
              <input type="text" name="website" />

              <label htmlFor="birthday">Birthday</label>
              <input type="date" name="birthday" />
            </div>
          </div>
          <button>Submit</button>
        </form>
      </Modal>
    </>
  );
}
