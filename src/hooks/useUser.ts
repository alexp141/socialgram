"use client";

import { getLoggedInUserPublic, getUser } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const {
    data: user,
    fetchStatus,
    error,
  } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => {
      return getLoggedInUserPublic();
    },
    staleTime: Infinity, //don't re fetch unless needed
  });

  return { user, fetchStatus, error };
}
