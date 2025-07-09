"use client";
import { useState } from "react";
import { AuthFormInput } from "../components/AuthFormInput";
import { AuthTabs } from "../components/AuthTabs";
import { AuthFormContainer } from "../components/AuthFormContainer";

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
        Reset Password
      </h3>
      <p className="w-full text-center text-gray-400 text-small md:text-regular">
        Set a new password that’s different from the old one
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="newPassword"
          label="New Password"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthFormInput
          id="confirmPassword"
          label="Confirm Password"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full flex justify-center md:justify-end my-10">
          <button
            type="submit"
            className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary"
          >
            Rsest Password{" "}
          </button>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default SignupPage;
