import {
  getFollowerCount,
  getFollowingCount,
  getProfileData,
} from "@/lib/actions";
import ProfileEditorForm from "./ProfileEditorForm";
import { convertDate } from "@/lib/helper";
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
  const profilePicImagePath = avatar_url;
  const bannerImagePath = banner_url;
  const profileImageSource = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/profile/${profilePicImagePath}`;
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
              className="border-2 border-sky-400 rounded-full"
            />
          ) : (
            <Image
              src="/empty-avatar.png"
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
              className="border-2 border-sky-400 rounded-full"
            />
          )}
        </div>
      </div>
      {profileUserId === loggedInUserId ? (
        <ProfileEditorForm
          userId={profileUserId}
          username={username}
          initialAvatar={profileImageSource}
          initialBanner={bannerImageSource}
        />
      ) : (
        <div className="flex justify-end my-1">
          <FollowButton
            userToFollow={profileUserId}
            currUserId={loggedInUserId}
          />
        </div>
      )}

      <div className="px-6">
        <div className="">@{profileData.data?.username}</div>
        <div className="my-6">bio: {bio}</div>
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
          <Link href={`/${username}/following`}>
            <div className="flex gap-1">
              <p>Following</p>
              <p>{followingCount}</p>
            </div>
          </Link>
          <Link href={`/${username}/followers`}>
            <div className="flex gap-1">
              <p>Followers</p>
              <p>{followerCount}</p>
            </div>
          </Link>
        </div>
        {/* <div>
          <FollowButton userToFollow={userId} />
        </div> */}
      </div>
      <nav className="flex justify-evenly mt-4 items-stretch text-lg">
        <Link href={`/${username}`} className="p-4">
          Posts
        </Link>
        <Link href={`/${username}/favorites`} className="p-4">
          Favorites
        </Link>
        <Link href={`/${username}/likes`} className="p-4">
          Likes
        </Link>
      </nav>
    </div>
  );
}
