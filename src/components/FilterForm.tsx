"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export default function FilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [timeSort, setTimeSort] = useState(
    () => searchParams.get("timeSort") || "newest"
  );
  const [searchFor, setSearchFor] = useState(
    () => searchParams.get("searchFor") || "posts"
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeSort", timeSort);
    params.set("searchFor", searchFor);
    router.push(`/explore?${params.toString()}`);
  }, [timeSort, searchFor, router, searchParams]);

  return (
    <div className="divide-y">
      <fieldset className="pb-4">
        <h2 className="mb-3 text-lg font-medium">Sort By</h2>
        <RadioGroup value={timeSort} onValueChange={setTimeSort}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest">Newest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oldest" id="oldest" />
            <Label htmlFor="oldest">Oldest</Label>
          </div>
        </RadioGroup>
      </fieldset>

      <fieldset className="pt-4">
        <h2 className="mb-3 text-lg font-medium">Search For</h2>
        <RadioGroup value={searchFor} onValueChange={setSearchFor}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="posts" id="posts" />
            <Label htmlFor="posts">Posts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="users" id="users" />
            <Label htmlFor="users">Users</Label>
          </div>
        </RadioGroup>
      </fieldset>
    </div>
  );
}
