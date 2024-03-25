"use client";

import { usePathname } from "next/navigation";

export default function ExtrasContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const leaf = pathName.split("/").slice(-1).join();

  if (title === "Filters" && leaf !== "explore") {
    return null;
  }

  return (
    <div className=" w-80 bg-zinc-300 border rounded-xl p-2 max-w-[25rem] mx-4">
      <h2 className="text-center font-semibold text-xl border-b border-b-sky-500">
        {title}
      </h2>
      {children}
    </div>
  );
}
