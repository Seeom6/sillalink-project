"use client";

import { ReactNode } from "react";
import Image from "next/image";
// import authImage from "@/public/assets/login-illustrator.svg";

interface AuthFormContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthFormContainer = ({
  children,
  title,
  subtitle,
}: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen flex justify-center items-start flex-col lg:flex-row">
      <div className="hidden lg:block w-1/2">
        <div className="h-full flex items-center justify-center p-12">
          <Image
            src="/assets/login-illustrator.svg"
            alt="Authentication illustration"
            width={706}
            height={706}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2.5 md:p-8">
        <div className="w-full flex flex-col gap-5 p-2.5 md:p-10 bg-gradient-to-tr from-gray-100/20 to-transparent border border-primary rounded-2xl">
          <h1 className="text-regular text-center font-bold text-gray-100 mb-2">
            {title}
          </h1>
          <div className="flex lg:hidden items-center justify-center">
            <Image
              src="/assets/login-illustrator.svg"
              alt="Authentication illustration"
              width={200}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
          <h2 className="text-small md:text-regular text-start font-bold text-gray-400 mb-2">
            {subtitle}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};