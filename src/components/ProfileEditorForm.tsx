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
  initialBanner,
}: {
  userId: string;
  username: string;
  initialAvatar: string;
  initialBanner: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [isBannerCropperOpen, setIsBannerCropperOpen] = useState(false);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [banner, setBanner] = useState(initialBanner);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

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

  function onBannerLoadError() {
    setBanner("/default-banner.jpg");
  }

  return (
    <div className="flex justify-end items-center p-2">
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 border rounded-full"
      >
        Edit Profile
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Edit Profile">
        <form action={handleAction}>
          <div className="flex justify-center items-center gap-8">
            <div className="flex flex-col gap-2">
              <Image
                src={avatar}
                width={200}
                height={200}
                alt="test"
                className="border-2 dark:border-blue-800 rounded-full"
              />

              <input
                type="file"
                name="profileImage"
                hidden
                ref={avatarInputRef}
              />
              <Modal
                isOpen={isAvatarCropperOpen}
                setIsOpen={setIsAvatarCropperOpen}
                title="Edit Avatar"
              >
                <ImageCropper
                  cropAspectRatio={1}
                  cropMinimumWidth={100}
                  fileName="profile-pic"
                  inputName="profileImage"
                  setIsCropperOpen={setIsAvatarCropperOpen}
                  updateImage={setAvatar}
                  exteriorInputRef={avatarInputRef}
                  circularCrop={true}
                />
              </Modal>

              <button
                type="button"
                className="border border-sky-100 rounded-full bg-blue-800 px-4 py-2"
                onClick={() => setIsAvatarCropperOpen(true)}
              >
                Change Avatar
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <Image
                src={banner}
                width={400}
                height={150}
                alt="test"
                onError={onBannerLoadError}
                className="rounded-md"
              />
              <button
                type="button"
                className="border border-sky-100 rounded-full bg-blue-800 px-4 py-2"
                onClick={() => setIsBannerCropperOpen(true)}
              >
                Change Banner
              </button>
              <Modal
                isOpen={isBannerCropperOpen}
                setIsOpen={setIsBannerCropperOpen}
                title="Edit Banner"
              >
                <ImageCropper
                  cropAspectRatio={16 / 9}
                  cropMinimumWidth={200}
                  fileName="banner"
                  inputName="banner"
                  setIsCropperOpen={setIsBannerCropperOpen}
                  updateImage={setBanner}
                  exteriorInputRef={bannerInputRef}
                  circularCrop={false}
                />
              </Modal>
            </div>
          </div>

          <div>
            <div className="flex flex-col">
              <input type="file" name="banner" hidden ref={bannerInputRef} />
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
          <div className="flex justify-center">
            <button className="border border-sky-100 rounded-full bg-blue-800 px-4 py-2 mt-6 text-xl">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
