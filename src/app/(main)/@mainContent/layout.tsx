import Sidebar from "@/components/Sidebar";

export default function MainContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //general layout for @mainContent
    <div className={`w-[35rem] border-x border-slate-500 border-b`}>
      {children}
    </div>
  );
}
