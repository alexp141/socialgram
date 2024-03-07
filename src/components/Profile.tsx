import { getProfileData } from "@/lib/actions";
import ProfileEditorForm from "./ProfileEditorForm";
import { convertDate } from "@/lib/helper";
import Image from "next/image";

export default async function Profile({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) {
  const profileData = await getProfileData(username);

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
    console.log(profileData.error);
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
    <div className="flex flex-col md:min-w-[35rem] lg:max-w-[40rem] border-x border-red-500">
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
          <p>following</p>
          <p>followers</p>
        </div>
        <div>nav</div>
      </div>
    </div>
  );
}
