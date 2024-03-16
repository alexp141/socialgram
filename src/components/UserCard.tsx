"use client";

import { UserCardType } from "@/lib/types/type-collection";
import Image from "next/image";
import FollowButton from "./FollowButton";

export default function UserCard({
  info,
  currUserId,
  isAlreadyFollowing = false,
}: {
  info: UserCardType;
  currUserId?: string;
  isAlreadyFollowing?: boolean;
}) {
  const avatar = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/profile/${info.avatar_url}`;

  return (
    <div className="flex gap-1">
      <div className=" flex-shrink-0">
        <Image
          className="border rounded-full"
          src={avatar}
          width={50}
          height={50}
          alt="avatar"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <p>@{info.username}</p>
        <div className=" overflow-y-hidden overflow-ellipsis">
          <p className="my-1 line-clamp-2">{info.bio}</p>
        </div>
      </div>
      <div className="flex justify-center item-center">
        <FollowButton
          currUserId={currUserId}
          isAlreadyFollowing={isAlreadyFollowing}
          userToFollow={info.user_id}
        />
      </div>
    </div>
  );
}
