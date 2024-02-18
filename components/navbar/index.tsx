"use client";
import { FaGithub } from "react-icons/fa";
import ThemeSwitch from "../theme-switch";
import Link from "next/link";

const Navbar = ({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: any;
}) => {
  return (
    <div className="py-2 px-4 border-b border-primary-border flex items-center w-full justify-between">
      <h1 className="italic">heading</h1>
      <div className="flex items-center gap-1">
        <Link
          href="https://github.com/syedsaif666/radix-tailwindcss-theme"
          target="_blank"
        >
          <div className="p-2.5 hover:bg-primary-bg-hover rounded-md cursor-pointer">
            <FaGithub className="text-primary-text text-xl" />
          </div>
        </Link>
        <ThemeSwitch isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    </div>
  );
};

export default Navbar;
