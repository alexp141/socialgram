import Link from "next/link";
import {
  FaBookBookmark,
  FaHouse,
  FaCircleQuestion,
  FaPenToSquare,
  FaUser,
  FaTurnDown,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import CreatePost from "./CreatePost";

export default function MobileNavbar() {
  return (
    <div className="flex sticky bottom-0 bg-black/90 sm:hidden w-full justify-between p-4 px-4 items-baseline">
      <Link href={"/home"}>
        <FaHouse />
      </Link>
      <Link href={"/favorites"}>
        <FaBookBookmark />
      </Link>
      <div>
        <CreatePost />
      </div>
      <Link href={"/explore"}>
        <FaMagnifyingGlass />
      </Link>
      <div>
        <button>
          <FaCircleQuestion />
        </button>
      </div>
    </div>
  );
}
