"use client";

import Link from "next/link";

interface AuthTabsProps {
  activeTab: "login" | "signup";
  setActiveTab: (tab: "login" | "signup") => void;
}

export const AuthTabs = ({ activeTab, setActiveTab }: AuthTabsProps) => {
  return (
    <div className="flex w-full justify-center items-center border-gray-200 mb-6">
      <div className="w-4/5 md:w-fit flex justify-between bg-secondary p-2.5 md:p-[14px] rounded-[33px] m-4">
        <Link
          href={"/login"}
          className={`py-2 px-8 md:px-10 text-small md:text-regular font-medium transition-all duration-300 ease-in-out ${
            activeTab === "login"
              ? "text-gray-100 bg-primary font-semibold rounded-[33px]"
              : "text-primary hover:bg-primary/20 hover:rounded-[33px]"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </Link>
        <Link
          href={"/signup/email-confirm"}
          className={`py-2 px-8 md:px-10 text-small md:text-regular font-semibold transition-all duration-300 ease-in-out ${
            activeTab === "signup"
              ? "text-gray-100 bg-primary rounded-[33px]"
              : "text-primary hover:bg-primary/20 hover:rounded-[33px]"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};