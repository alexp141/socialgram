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
  initialAvatar,
}: {
  userId: string;
  username: string;
  initialAvatar: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [avatar, setAvatar] = useState(initialAvatar);
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
                <Image src={avatar} width={200} height={200} alt="test" />
                <button
                  type="button"
                  className="border rounded-sm bg-orange-700"
                  onClick={() => setIsAvatarCropperOpen(true)}
                >
                  Change Avatar
                </button>
                <input
                  type="file"
                  name="profileImage"
                  hidden
                  ref={avatarInputRef}
                />
                <Modal
                  isOpen={isAvatarCropperOpen}
                  setIsOpen={setIsAvatarCropperOpen}
                  title="Edit Profile"
                >
                  <ImageCropper
                    cropAspectRatio={1}
                    cropMinimumWidth={100}
                    fileName="profile-pic"
                    inputName="profileImage"
                    setIsAvatarCropperOpen={setIsAvatarCropperOpen}
                    updateImage={setAvatar}
                    exteriorInputRef={avatarInputRef}
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
