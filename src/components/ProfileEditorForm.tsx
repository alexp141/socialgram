"use client";

import { useState } from "react";
import Modal from "./Modal";
import { updateProfile } from "@/lib/actions";
import { toast } from "react-toastify";

export default function ProfileEditorForm({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
              <div>pfi</div>
              <label htmlFor="profileImage">Change Profile Picture</label>
              <input type="file" name="profileImage" />

              <label htmlFor="bannerImage">Change banner</label>
              <input type="file" name="bannerImage" />
            </div>
            <div className="flex flex-col">
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
