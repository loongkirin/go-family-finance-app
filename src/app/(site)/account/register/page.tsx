import { RegisterForm } from "@/features/components/register-form";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default page;