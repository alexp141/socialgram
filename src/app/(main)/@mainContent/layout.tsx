import Sidebar from "@/components/Sidebar";

export default function MainContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //general layout for @mainContent
    <div
      className={`w-full md:w-[35rem] lg:max-w-[35rem] border-x border-zinc-900 border-b dark:border-zinc-100`}
    >
      {children}
    </div>
  );
}
