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
    <div className="bg-zinc-300 dark:bg-transparent border rounded-xl p-2 max-w-[20rem] mx-4 lg:min-w-[16rem]">
      <h2 className="text-center font-semibold text-xl border-b border-b-sky-500">
        {title}
      </h2>
      {children}
    </div>
  );
}
