"use client";
import { useState } from "react";
import { AuthFormInput } from "./../components/AuthFormInput";
import { AuthTabs } from "./../components/AuthTabs";
import { AuthFormContainer } from "./../components/AuthFormContainer";

import Link from "next/link";

const SignupPage = () => {
    const [verificationCode , setVerificationCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ verificationCode });
  };

  return (
    <AuthFormContainer title="Welcome to Sillalink..!" subtitle="">
      {/* <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <h3 className="w-full text-gray-100 text-medium text-center md:text-large font-bold">
        Verify Your Email Address
      </h3>
      <p className="w-full px-3 md:px-14 text-gray-400 text-small md:text-regular">
        We’ve sent a verification link to your email. Please check your inbox
        and click the link to activate your account."
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="verificationCode"
          label="Verification Code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />

        <div className="w-full flex justify-center md:justify-end my-10">
          <button
            type="submit"
            className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary"
          >
            Verify me{" "}
          </button>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default SignupPage;
