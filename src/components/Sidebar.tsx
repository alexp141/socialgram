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
import ThemeButton from "./ThemeButton";

const sidebarTextStyle = "hidden md:inline ";

export default async function Sidebar() {
  const username = (await getUser()).user_metadata.username;

  return (
    <div className="hidden sm:block sm:px-4 md:px-10 lg:px-4 sm:py-6 lg:max-w-64 text-sky-500 font-extrabold justify-self-end">
      <div className="flex flex-col gap-4 text-xl lg:text-lg xl:text-xl sticky top-4">
        <SideBarLink path="/home">
          <FaHouse />
          <span className={sidebarTextStyle}>Home</span>
        </SideBarLink>
        <SideBarLink path="/favorites">
          <FaBookBookmark />
          <span className={sidebarTextStyle}>Favorites</span>
        </SideBarLink>
        <SideBarLink path="/about">
          <FaCircleQuestion />
          <span className={sidebarTextStyle}>About</span>
        </SideBarLink>
        <SideBarLink path="#">
          <CreatePost displayAsSidebarButton />
        </SideBarLink>
        <SideBarLink path={`/user/${username}`}>
          <FaUser />
          <span className={sidebarTextStyle}>Profile</span>
        </SideBarLink>
        <SideBarLink path={`/explore`}>
          <FaMagnifyingGlass />
          <span className={sidebarTextStyle}>Explore</span>
        </SideBarLink>
        <SideBarLink path="#">
          <ThemeButton />
        </SideBarLink>
        <SideBarLink path="#">
          <FaTurnDown />
          <SignOutButton style={sidebarTextStyle} />
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
      <div className="flex md:gap-2 items-center justify-center md:justify-start hover:text-sky-500 rounded-full hover:bg-sky-900 p-2 lg:p-1">
        {children}
      </div>
    </Link>
  );
}
