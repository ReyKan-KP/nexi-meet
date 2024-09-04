"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { cn } from "@lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  const [isThemeMode, setIsThemeMode] = useState("dark");

  const toggleMode = () => {
    setIsThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <section
      className={cn(
        "sticky left-0 top-0 flex h-screen w-fit flex-col justify-between p-6 pt-28 max-sm:hidden lg:w-[264px] bg-teal-100",
        // {
        //   "bg-dark-1 text-white": isThemeMode === "dark",
        //   "bg-light-1 text-black": isThemeMode === "light",
        // }
      )}
    >
      {/* <button onClick={toggleMode} className="mb-4">
        Toggle Mode
      </button> */}
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex gap-4 items-center p-4 rounded-lg justify-start",
                {
                  "bg-blue-1": isActive,
                }
              )}
            >
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
