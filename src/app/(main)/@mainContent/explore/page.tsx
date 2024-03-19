import SearchBar from "@/components/SearchBar";
import SearchFeed from "@/components/SearchFeed";
import { SearchParams } from "@/lib/types";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  console.log("SEARCH PARAMS", searchParams);
  return (
    <div>
      <SearchBar />
      <SearchFeed itemsPerPage={5} searchParams={searchParams} />
    </div>
  );
}
