"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function FilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  function updateSearchParams(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString());

    formData.forEach((value, key, parent) => {
      console.log(value, key, parent);
      params.set(key, value.toString());
    });

    router.push(`/explore?${params.toString()}`);
  }

  return (
    <form action={updateSearchParams} ref={formRef} className="divide-y">
      <fieldset>
        <h2>Sort By</h2>
        <div className="flex gap-2">
          <input
            type="radio"
            name="timeSort"
            id="newest"
            value="newest"
            defaultChecked={
              !searchParams.get("timeSort") ||
              searchParams.get("timeSort")?.toString() === "newest"
            }
            onChange={() => formRef.current?.requestSubmit()}
          />
          <label htmlFor="newest">Newest</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            name="timeSort"
            id="oldest"
            value="oldest"
            defaultChecked={
              searchParams.get("timeSort")?.toString() === "oldest"
            }
            onChange={() => formRef.current?.requestSubmit()}
          />
          <label htmlFor="oldest">Oldest</label>
        </div>
      </fieldset>

      <fieldset className="">
        <h2>Search For</h2>
        <div className="flex gap-2">
          <input
            type="radio"
            name="searchFor"
            id="postsInput"
            value="posts"
            defaultChecked={
              !searchParams.get("timeSort") ||
              searchParams.get("searchFor")?.toString() === "posts"
            }
            onChange={() => formRef.current?.requestSubmit()}
          />
          <label htmlFor="postsInput">Posts</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            name="searchFor"
            id="usersInput"
            value="users"
            defaultChecked={
              searchParams.get("searchFor")?.toString() === "users"
            }
            onChange={() => formRef.current?.requestSubmit()}
          />
          <label htmlFor="usersInput">Users</label>
        </div>
      </fieldset>
    </form>
  );
}
