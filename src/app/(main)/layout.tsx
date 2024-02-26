import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`md:flex md:justify-center md:w-screen`}>
      <div className="sm:grid sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
