import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  mainContent,
  extras,
}: {
  mainContent: React.ReactNode;
  extras: React.ReactNode;
}) {
  //max-h-screen overflow-y-scroll bg-[url(/background.jpg)] bg-cover bg-bottom
  return (
    <div>
      <div className="md:flex md:justify-center min-h-screen bg-gradient-to-r from-zinc-50 via-zinc-50 to-zinc-50 dark:bg-none dark:bg-gray-950">
        <div className="flex sm:grid sm:grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] lg:grid-cols-[1fr_auto_1fr] min-h-screen">
          <Sidebar />
          {mainContent}
          {extras}
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}
