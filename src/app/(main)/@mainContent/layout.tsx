import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //general layout for @mainCon
    <div
      className={`md:min-w-[35rem] lg:max-w-[40rem] border-x border-red-500`}
    >
      {children}
    </div>
  );
}
