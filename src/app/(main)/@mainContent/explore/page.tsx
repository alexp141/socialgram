import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import SearchFeed from "@/components/SearchFeed";
import { SearchParams } from "@/lib/types";
import { Suspense } from "react";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <SearchBar />
        <SearchFeed itemsPerPage={10} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
