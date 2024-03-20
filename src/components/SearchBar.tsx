"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function updateSearchParams(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString());
    console.log(formData.get("timeSort"));
    formData.forEach((value, key, parent) => {
      console.log(value, key, parent);
      params.set(key, value.toString());
    });

    router.push(`/explore?${params.toString()}`);
  }

  return (
    <>
      <form action={updateSearchParams}>
        <input
          className="w-full border-1 border-sky-300 p-2 rounded-full text-xl"
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          defaultValue={searchParams.get("search") ?? ""}
        />
      </form>
    </>
  );
}
