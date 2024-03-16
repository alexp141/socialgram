import Link from "next/link";
import CreatePost from "./CreatePost";
import SignOutButton from "./SignOutButton";
import { getUser } from "@/lib/actions";
import {
  FaBookBookmark,
  FaHouse,
  FaCircleQuestion,
  FaPenToSquare,
  FaUser,
  FaTurnDown,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const linkStyle = "flex";

export default async function Sidebar() {
  const username = (await getUser()).user_metadata.username;

  return (
    <div className="hidden sm:block sm:px-10 sm:py-6">
      <div className="flex flex-col gap-5 text-2xl font-semibold sticky top-4">
        <SideBarLink>
          <FaHouse />
          <Link href="/home">Home</Link>
        </SideBarLink>
        <SideBarLink>
          <FaBookBookmark />
          <Link href="/favorites">Favorites</Link>
        </SideBarLink>
        <SideBarLink>
          <FaCircleQuestion />
          <Link href="/about">About</Link>
        </SideBarLink>
        <SideBarLink>
          <FaPenToSquare />
          <CreatePost />
        </SideBarLink>
        <SideBarLink>
          <FaUser />
          <Link href={`/${username}`}>Profile</Link>
        </SideBarLink>
        <SideBarLink>
          <FaMagnifyingGlass />
          <Link href={`/explore`}>Explore</Link>
        </SideBarLink>
        <SideBarLink>
          <FaTurnDown />
          <SignOutButton />
        </SideBarLink>
      </div>
    </div>
  );
}

function SideBarLink({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 items-center">{children}</div>;
}
