import Sidebar from "@/components/Sidebar";

export default function MainContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //general layout for @mainContent
    <div
      className={`md:min-w-[35rem] lg:max-w-[40rem] border-x border-red-500`}
    >
      {children}
    </div>
  );
}
