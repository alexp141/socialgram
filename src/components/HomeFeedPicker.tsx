"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function HomeFeedPicker() {
  const searchParams = useSearchParams();
  const res = searchParams.get("feed");
  const isAtForYouRoute = !res || res === "forYou";
  const linkStyle = `text-2xl font-semibold`;
  const selectedLinkStyle = `text-sky-500 underline underline-offset-8`;

  return (
    <div className="flex text-center p-4 divide-x-2">
      <div className="justify-center items-center flex-1">
        <Link
          className={`${linkStyle} ${isAtForYouRoute ? selectedLinkStyle : ""}`}
          href={`/home?feed=forYou`}
        >
          For You
        </Link>
      </div>
      <div className="justify-center items-center flex-1">
        <Link
          className={`${linkStyle} ${
            !isAtForYouRoute ? selectedLinkStyle : ""
          }`}
          href={`/home?feed=following`}
        >
          Following
        </Link>
      </div>
    </div>
  );
}
