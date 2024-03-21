import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  mainContent,
  extras,
}: {
  mainContent: React.ReactNode;
  extras: React.ReactNode;
}) {
  return (
    <div className="md:flex md:justify-center md:max-w-screen">
      <div className="sm:grid sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr]">
        <Sidebar />
        {mainContent}
        {extras}
      </div>
    </div>
  );
}
