import { UserCardType } from "@/lib/types/type-collection";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { getAvatarImage } from "@/lib/helper";
import Link from "next/link";

export default function UserCard({
  info,
  currUserId,
  isAlreadyFollowing = false,
}: {
  info: UserCardType;
  currUserId?: string;
  isAlreadyFollowing?: boolean;
}) {
  const avatar = getAvatarImage(info.avatar_url);
  const avatarStyle = "border-2 rounded-full border-sky-400";
  return (
    <div className="flex gap-1 items-center mt-2">
      <div className=" flex-shrink-0 self-start">
        {avatar ? (
          <Link href={`/user/${info.username}`}>
            <Image
              className={avatarStyle}
              src={avatar}
              width={50}
              height={50}
              alt="avatar"
            />
          </Link>
        ) : (
          <Link href={`/user/${info.username}`}>
            <Image
              src="/empty-avatar.png"
              alt="default avatar pic"
              width={50}
              height={50}
              placeholder="empty"
              className={avatarStyle}
            />
          </Link>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <Link
          className="text-sky-500 font-medium hover:text-sky-500 overflow-ellipsis overflow-x-hidden"
          href={`/user/${info.username}`}
        >
          @{info.username}
        </Link>
        <div className=" overflow-y-hidden overflow-ellipsis">
          <p className="my-1 line-clamp-2">
            {info.bio ? (
              info.bio
            ) : (
              <span className=" opacity-50">{"<No Bio Set>"}</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex justify-center item-center flex-initial">
        <FollowButton
          currUserId={currUserId}
          isAlreadyFollowing={isAlreadyFollowing}
          userToFollow={info.user_id}
        />
      </div>
    </div>
  );
}
