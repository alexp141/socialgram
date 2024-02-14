export default function HomeLayout({
  children,
  feed,
  extras,
}: {
  children: React.ReactNode;
  feed: React.ReactNode;
  extras: React.ReactNode;
}) {
  return (
    <>
      {feed}
      {extras}
    </>
  );
}
