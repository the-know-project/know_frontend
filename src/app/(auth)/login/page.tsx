import LoginForm from "@/src/features/auth/components/login.form";
import { GuestOnlyGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { TitleText } from "@/src/shared/layout/header";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  return (
    <GuestOnlyGuard>
      <section className="relative z-50 flex w-full flex-col">
        <div className="flex items-center justify-between">
          <Image
            src="/Know-Logo.png"
            alt="Logo"
            width={60}
            height={60}
            quality={100}
          />
          <p className="font-bricolage text-sm font-medium text-neutral-600">
            Dont have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-5 flex w-full flex-col">
          <TitleText textStyles={`w-full`}>
            <h1 className="title_text">Welcome Back</h1>
          </TitleText>
          <div className="motion-preset-expand motion-duration-700 mt-10 flex max-w-full flex-col">
            <LoginForm />
          </div>
        </div>
      </section>
    </GuestOnlyGuard>
  );
};

export default Login;
