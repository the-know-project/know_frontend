import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const ResetSuccessPage = () => {
  return (
    <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left Panel */}
      <div className="flex flex-col px-8 py-12 md:px-16">
        {/* Header: Logo + Back link */}
        <div className="mb-10 flex items-center justify-between">
          <Image src="/Know-Logo.png" alt="Logo" width={60} height={60} />
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>

        {/* Content */}
        <div className="mx-auto mt-20 flex max-w-sm flex-col items-center justify-center text-center">
          <CheckCircle className="mb-6 h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-semibold text-black">All done!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been reset. You can now log in with your new
            password.
          </p>
        </div>
      </div>

      {/* Right Image Panel */}
      <div className="relative hidden md:block">
        <Image
          src="/roleselect.png" // Replace with your actual path
          alt="success"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default ResetSuccessPage;
