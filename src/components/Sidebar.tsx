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
    <div className="hidden sm:block sm:px-10 sm:py-6 max-w-72 justify-self-end text-sky-500 font-extrabold">
      <div className="flex flex-col gap-2 text-2xl sticky top-4">
        <SideBarLink path="/home">
          <FaHouse />
          <span>Home</span>
        </SideBarLink>
        <SideBarLink path="/favorites">
          <FaBookBookmark />
          <span>Favorites</span>
        </SideBarLink>
        <SideBarLink path="/about">
          <FaCircleQuestion />
          <span>About</span>
        </SideBarLink>
        <SideBarLink path="">
          <FaPenToSquare />
          <CreatePost />
        </SideBarLink>
        <SideBarLink path={`/user/${username}`}>
          <FaUser />
          <span>Profile</span>
        </SideBarLink>
        <SideBarLink path={`/explore`}>
          <FaMagnifyingGlass />
          <span>Explore</span>
        </SideBarLink>
        <SideBarLink path="">
          <FaTurnDown />
          <SignOutButton />
        </SideBarLink>
      </div>
    </div>
  );
}

function SideBarLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  return (
    <Link href={path}>
      <div className="flex gap-2 items-center hover:text-sky-500 rounded-full hover:bg-sky-900 p-2">
        {children}
      </div>
    </Link>
  );
}
