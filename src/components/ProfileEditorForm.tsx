"use client";

import { useRef, useState } from "react";
import Modal from "./Modal";
import ImageCropper from "./ImageCropper";
import Image from "next/image";
import useProfileEditor from "@/hooks/useProfileEditor";

export default function ProfileEditorForm({
  profileData,
  userId,
  username,
  initialAvatar,
  initialBanner,
}: {
  userId: string;
  username: string;
  initialAvatar: string;
  initialBanner: string;
  profileData: {
    created_at: string;
    user_id: string;
    username: string;
    bio: string;
    birthday: any;
    location: string;
    avatar_url: string;
    banner_url: string;
    first_name: string;
    last_name: string;
    website: string;
  };
}) {
  const { editProfile, editProfileError, editProfileStatus } =
    useProfileEditor(username);
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

  function handleAction(formData: FormData) {
    //upload form
    editProfile({ userId, username, formData });
    console.log("profile updated");

    setIsOpen(false);
  }
  return (
    <div className="flex justify-end items-center p-2">
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 border-2 rounded-full border-sky-50 hover:bg-sky-700 bg-sky-400 text-sky-50"
      >
        Edit Profile
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Edit Profile">
        <form action={handleAction}>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <div className="flex flex-col gap-2">
              <Image
                src={avatar}
                width={200}
                height={200}
                alt="test"
                className="border-2 border-sky-500 rounded-full"
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
                className="border-2 border-sky-100 rounded-full bg-sky-500 px-4 py-2 text-sky-50"
                onClick={() => setIsAvatarCropperOpen(true)}
              >
                Change Avatar
              </button>
              {avatar !== initialAvatar && (
                <button
                  type="button"
                  className="border-2 border-sky-100 rounded-full bg-amber-500 px-4 py-2 text-sky-50"
                  onClick={() => setAvatar(initialAvatar)}
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Image
                src={banner}
                width={400}
                height={150}
                alt="test"
                // onError={onBannerLoadError}
                className="border-2 border-sky-500 rounded-md"
              />
              <button
                type="button"
                className="border-2 border-sky-100 rounded-full bg-sky-500 px-4 py-2 text-sky-50"
                onClick={() => setIsBannerCropperOpen(true)}
              >
                Change Banner
              </button>
              {banner !== initialBanner && (
                <button
                  type="button"
                  className="border-2 border-sky-100 rounded-full bg-amber-500 px-4 py-2 text-sky-50"
                  onClick={() => setBanner(initialBanner)}
                >
                  Clear Selection
                </button>
              )}
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
          <p className="text-center text-emerald-500 mt-4">
            *Changes to avatars and banners may take up to 15 minutes to
            update!*
          </p>
          <div className="mt-4">
            <input type="file" name="banner" hidden ref={bannerInputRef} />
            <div className="flex flex-col [&>input]:p-2 [&>input]:text-lg [&>input]:rounded-md [&>input]:border [&>input]:border-sky-500 [&>input:focus]:outline-sky-500 [&>input:focus]:outline [&>label]:text-lg [&>label]:mt-2">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={profileData.first_name}
              />

              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={profileData.last_name}
              />

              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                defaultValue={profileData.bio}
                className=" min-h-24 p-2 text-lg rounded-md border border-sky-500 focus:outline-sky-500"
              />

              <label htmlFor="location">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={profileData.location}
              />

              <label htmlFor="website">Website</label>
              <input
                type="text"
                name="website"
                defaultValue={profileData.website}
              />

              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                name="birthday"
                defaultValue={profileData.birthday}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="border-2 border-sky-100 rounded-full bg-sky-500 px-4 py-2 text-sky-50 mt-4"
              disabled={editProfileStatus === "pending"}
            >
              {editProfileStatus === "pending" ? (
                <span>Loading...</span>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
