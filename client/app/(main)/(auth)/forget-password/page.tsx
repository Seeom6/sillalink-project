"use client";
import { useState } from "react";
import { AuthFormInput } from "./../components/AuthFormInput";
import { AuthTabs } from "./../components/AuthTabs";
import { AuthFormContainer } from "./../components/AuthFormContainer";

import Link from "next/link";

const SignupPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ email });
  };

  return (
    <AuthFormContainer title="Welcome to Sillalink..!" subtitle="">
      <h3 className="w-full text-gray-100 text-medium text-center md:text-large font-bold">
        Forget Password{" "}
      </h3>
      <p className="w-full text-center text-gray-400 text-small md:text-regular">
        No worries! Enter your email to reset your password
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full text-extraSmall md:text-small justify-start items-center flex gap-4 text-gray-100">
          <h2>Already have account?</h2>
          <Link
            href={"/login"}
            className="text-small md:text-regular text-blue-600 capitalize border-b"
          >
            log in
          </Link>
        </div>
        <div className="w-full text-extraSmall md:text-small justify-start items-center flex gap-4 text-gray-100">
          <h2>Don’t have account?</h2>
          <Link
            href={"/login"}
            className="text-small md:text-regular border-b text-blue-600 capitalize"
          >
            sign up
          </Link>
        </div>
        <div className="w-full text-extraSmall md:text-small justify-start items-center flex gap-4 text-gray-100 border-t pt-4">
          <h2>
            You may contact{" "}
            <Link
              href={""}
              className="text-small md:text-regular border-b text-primary capitalize"
            >
              Customer Service
            </Link>{" "}
            for help restoring access to your account.
          </h2>
        </div>
        <div className="w-full flex justify-center md:justify-end my-10">
          <button
            type="submit"
            className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary"
          >
            Send Code{" "}
          </button>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default SignupPage;
