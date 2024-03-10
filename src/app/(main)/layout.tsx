import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
  mainContent,
  extras,
}: {
  children: React.ReactNode;
  mainContent: React.ReactNode;
  extras: React.ReactNode;
}) {
  return (
    <div className={`md:flex md:justify-center md:w-screen`}>
      <div className="sm:grid sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr]">
        <Sidebar />
        {mainContent}
        {extras}
      </div>
    </div>
  );
}
