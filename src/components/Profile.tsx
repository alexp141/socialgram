import { getProfileData } from "@/lib/actions";
import ProfileEditorForm from "./ProfileEditorForm";
import { convertDate } from "@/lib/helper";

export default async function Profile({ username }: { username: string }) {
  //get banner
  //get pf
  //get following
  //get followers
  //get bio
  //get name
  //get username
  //get join date
  //get birthday
  const profileData = await getProfileData(username);
  if (profileData.error || !profileData.data) {
    console.log(profileData.error);
    return <p>error retrieving user data</p>;
  }
  const {
    created_at,
    bio,
    birthday,
    location,
    user_id: userId,
  } = profileData.data;

  const joinDate = convertDate(new Date(created_at).toString())
    .split(" ")
    .slice(0, 3)
    .join(" ");

  return (
    <div className="flex flex-col">
      <div className="w-[600px] h-[200px] bg-red-900">banner</div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>pf</div>
          <ProfileEditorForm userId={userId} username={username} />
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
