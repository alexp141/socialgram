import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={`flex justify-center px-[16rem]`}>
          <div className="grid grid-cols-[1fr_1.5fr_1fr] w-full">
            <Sidebar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
