import SearchBar from "@/components/SearchBar";
import SearchFeed from "@/components/SearchFeed";
import { SearchParams } from "@/lib/types";
import { Suspense } from "react";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  console.log("SEARCH PARAMS", searchParams);
  return (
    <div>
      <Suspense fallback={<p>loading feed...</p>}>
        <SearchBar />
        <SearchFeed itemsPerPage={5} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
