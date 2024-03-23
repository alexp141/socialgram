import {
  getFollowerCount,
  getFollowingCount,
  getProfileData,
} from "@/lib/actions";
import ProfileEditorForm from "./ProfileEditorForm";
import { convertDate, getAvatarImage } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot, FaCalendarDays, FaCakeCandles } from "react-icons/fa6";
import FollowButton from "./FollowButton";

export default async function Profile({
  username,
  profileUserId,
  loggedInUserId,
}: {
  username: string;
  profileUserId: string;
  loggedInUserId: string;
}) {
  const data = await Promise.all([
    getProfileData(username),
    getFollowerCount(profileUserId),
    getFollowingCount(profileUserId),
  ]);
  if (data[0].error || data[1].error || data[2].error) {
    console.error(data[0].error || data[1].error || data[2].error);
    throw new Error(
      data[0].error ||
        data[1].error ||
        data[2].error ||
        "error getting follower data"
    );
  }
  const profileData = data[0];
  const followerCount = data[1].count;
  const followingCount = data[2].count;

  if (profileData.error || !profileData.data) {
    console.error(profileData.error);
    return <p>error retrieving user data</p>;
  }
  const { created_at, bio, birthday, location, avatar_url, banner_url } =
    profileData.data;
  const bannerImagePath = banner_url;
  const profileImageSource = getAvatarImage(avatar_url);

  const bannerImageSource = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/profile/${bannerImagePath}`;

  const joinDate = convertDate(new Date(created_at).toString())
    .split(" ")
    .slice(0, 3)
    .join(" ");

  return (
    <div className="flex flex-col">
      <div className="relative h-[200px]">
        {banner_url ? (
          <Image
            src={bannerImageSource}
            alt="banner"
            fill
            placeholder="empty"
          />
        ) : (
          <Image
            src="/default-banner.jpg"
            alt="default banner"
            fill
            placeholder="empty"
          />
        )}
        <div className="absolute top-full left-6 -translate-y-1/2">
          {avatar_url ? (
            <Image
              src={profileImageSource}
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
              className="outline outline-blue-400 rounded-full"
            />
          ) : (
            <Image
              src="/empty-avatar.png"
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
              className="outline outline-blue-400 rounded-full"
            />
          )}
        </div>
      </div>
      {profileUserId === loggedInUserId ? (
        <ProfileEditorForm
          userId={profileUserId}
          username={username}
          initialAvatar={profileImageSource || "/empty-avatar.png"}
          initialBanner={bannerImageSource}
        />
      ) : (
        <div className="flex justify-end items-center p-2">
          <FollowButton
            userToFollow={profileUserId}
            currUserId={loggedInUserId}
          />
        </div>
      )}

      <div className="px-6 text-slate-400">
        <div className="mb-4 text-xl text-blue-500">
          @{profileData.data?.username}
        </div>
        {bio && <p className="my-6 dark:text-sky-100">{bio}</p>}
        <div className="flex gap-4">
          {location && (
            <div className="flex gap-1 items-center">
              <FaLocationDot />
              <span>{location}</span>
            </div>
          )}
          {joinDate && (
            <div className="flex gap-1 items-center">
              <FaCalendarDays />
              <span>Joined on {joinDate}</span>
            </div>
          )}
          {birthday && (
            <div className="flex gap-1 items-center">
              <FaCakeCandles />
              <span>{birthday}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 py-2">
          <Link href={`/user/${username}/following`}>
            <div className="flex gap-1">
              <p>Following</p>
              <p className="text-sky-50">{followingCount}</p>
            </div>
          </Link>
          <Link href={`/user/${username}/followers`}>
            <div className="flex gap-1">
              <p>Followers</p>
              <p className="text-sky-50">{followerCount}</p>
            </div>
          </Link>
        </div>
      </div>
      <nav className="flex justify-evenly mt-4 items-stretch text-lg text-blue-500">
        <Link href={`/user/${username}`} className="p-4 hover:underline">
          Posts
        </Link>
        <Link
          href={`/user/${username}/favorites`}
          className="p-4 hover:underline"
        >
          Favorites
        </Link>
        <Link href={`/user/${username}/likes`} className="p-4 hover:underline">
          Likes
        </Link>
      </nav>
    </div>
  );
}
