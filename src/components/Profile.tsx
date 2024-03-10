import {
  getFollowerCount,
  getFollowingCount,
  getProfileData,
} from "@/lib/actions";
import ProfileEditorForm from "./ProfileEditorForm";
import { convertDate } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";

export default async function Profile({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  // const profileData = await getProfileData(username);
  // const followers = await getFollowers(userId);

  const data = await Promise.all([
    getProfileData(username),
    getFollowerCount(userId),
    getFollowingCount(userId),
  ]);
  if (
    data[0].error ||
    data[1].error ||
    !data[0] ||
    !data[1].count ||
    !data[2].count
  ) {
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
  //get banner
  //get pf
  //get following
  //get followers
  //get bio
  //get name
  //get username
  //get join date
  //get birthday

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
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          {avatar_url ? (
            <Image
              src={profileImageSource}
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
              className="border rounded-full"
            />
          ) : (
            <Image
              src="/empty-avatar.png"
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
              className="border rounded-full"
            />
          )}
          <ProfileEditorForm
            userId={userId}
            username={username}
            initialAvatar={profileImageSource}
            initialBanner={bannerImageSource}
          />
        </div>
        <div>username: {profileData.data?.username}</div>
        <div>bio: {bio}</div>
        <div className="flex gap-2">
          <p>location: {location}</p>
          <p>join date: {joinDate}</p>
          <p>birthday: {birthday}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${username}/following`}>
            <div className="flex gap-1">
              <p>following</p>
              <p>{followingCount}</p>
            </div>
          </Link>
          <Link href={`/${username}/followers`}>
            <div className="flex gap-1">
              <p>followers</p>
              <p>{followerCount}</p>
            </div>
          </Link>
        </div>
        <div>
          <nav className="flex gap-2">
            <Link href={`/${username}`}>posts</Link>
            <Link href={`/${username}/favorites`}>favorites</Link>
            <Link href={`/${username}/likes`}>likes</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
