"use client";

import { validatePath } from "@/lib/actions";
import { updateProfile } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useProfileEditor(username: string) {
  const {
    mutate: editProfile,
    error: editProfileError,
    status: editProfileStatus,
  } = useMutation({
    mutationFn: ({
      userId,
      username,
      formData,
    }: {
      userId: string;
      username: string;
      formData: FormData;
    }) => updateProfile(userId, username, formData),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Successfully updated profile");
      validatePath(`/user/${username}`);
    },
  });

  return { editProfile, editProfileError, editProfileStatus };
}
