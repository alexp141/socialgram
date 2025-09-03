"use client";

import { UsersRow } from "@/lib/types/type-collection";
import { useState } from "react";
import UserCard from "./UserCard";
import { Button } from "./ui/button";

export default function RecommendedUsers({ users }: { users: UsersRow[] }) {
  const [listLength, setListLength] = useState(4);
  const listToShow = users.slice(0, listLength);

  function handleShowMore() {
    setListLength(users.length);
  }

  function handleShowLess() {
    setListLength(4);
  }

  return (
    <div>
      {listToShow.map(({ username, bio, avatar_url, user_id }) => {
        return (
          <UserCard
            key={user_id}
            info={{ username, bio, avatar_url, user_id }}
          />
        );
      })}

      {listLength < users.length && (
        <Button
          variant={"ghost"}
          onClick={handleShowMore}
          className="text-sky-500"
        >
          Show More
        </Button>
      )}

      {listLength > 4 && (
        <button type="button" onClick={handleShowLess} className="text-sky-500">
          Show Less
        </button>
      )}
    </div>
  );
}
