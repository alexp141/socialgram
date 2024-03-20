export default function ExtrasContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className=" min-w-48 bg-slate-500 border rounded-xl p-2 max-w-[25rem] mx-4">
      <h2 className="text-center font-semibold text-xl border-b">{title}</h2>
      {children}
    </div>
  );
}
