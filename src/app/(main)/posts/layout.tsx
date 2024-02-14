export default function layout({
  children,
  extras,
}: {
  children: React.ReactNode;
  extras: React.ReactNode;
}) {
  return (
    <>
      {children}
      {extras}
    </>
  );
}
