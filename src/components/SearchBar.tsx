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
        <h2 className="text-center p-2 text-xl text-sky-500 border-b border-gray-950">
          Explore
        </h2>
        <div className="p-2">
          <input
            className="w-full border border-gray-950 p-2 rounded-full text-xl my-4 focus:outline-2 focus:outline-sky-500"
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            defaultValue={searchParams.get("search") ?? ""}
          />
        </div>
      </form>
    </>
  );
}
