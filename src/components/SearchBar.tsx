export default function SearchBar() {

  return (
    <>
      <form>
        <input
          className="w-full border-1 border-sky-300 p-2 rounded-full text-xl"
          type="text"
          name="search"
          id="search"
          placeholder="Search"
        />
      </form>
    </>
  );
}
