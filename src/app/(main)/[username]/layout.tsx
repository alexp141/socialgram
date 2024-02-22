export default function layout({
  children,
  extras,
  profile,
}: {
  children: React.ReactNode;
  extras: React.ReactNode;
  profile: React.ReactNode;
}) {
  return (
    <>
      {children}
      {profile}
      {extras}
    </>
  );
}
