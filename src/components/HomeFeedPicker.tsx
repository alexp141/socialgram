import Link from "next/link";

export default function HomeFeedPicker() {
  const linkStyle = "text-2xl";

  return (
    <div className="flex text-center p-4 divide-x-2">
      <div className="justify-center items-center flex-1">
        <Link className={linkStyle} href={`/home?feed=forYou`}>
          For You
        </Link>
      </div>
      <div className="justify-center items-center flex-1">
        <Link className={linkStyle} href={`/home?feed=following`}>
          Following
        </Link>
      </div>
    </div>
  );
}
