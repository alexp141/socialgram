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
  const { created_at, bio, birthday, location, avatar_url } = profileData.data;
  const profilePicImagePath = avatar_url;
  const profileImageSource = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/profile/${profilePicImagePath}`;
  const joinDate = convertDate(new Date(created_at).toString())
    .split(" ")
    .slice(0, 3)
    .join(" ");

  return (
    <div className="flex flex-col">
      <div className="w-[600px] h-[200px] bg-red-900">banner</div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          {avatar_url && (
            <Image
              src={profileImageSource}
              alt="profile pic"
              width={100}
              height={100}
              placeholder="empty"
            />
          )}
          <ProfileEditorForm
            userId={userId}
            username={username}
            initialProfilePic={profileImageSource}
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
