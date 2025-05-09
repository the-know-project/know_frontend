'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { mainUser } from "../../../redux/slice/authSlice"; 
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

// Validation Schema
const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
});

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.state.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const userData = {
      ...values,
      username: values.email.split("@")[0], 
      role: role || "BUYER",
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Failed to register");

      const data = await res.json();
      dispatch(mainUser(data)); 
      router.push("/explore");
    } catch (err) {
      alert("Signup failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-white space-y-8">
        <div className="flex justify-between items-center">
          <Image src="/Know-Logo.png" alt="Logo" width={40} height={40} />
          <p className="text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Log In</Link>
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-1">Sign Up</h1>
        </div>

        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field name="firstName" placeholder="First Name" className="input input-bordered w-full" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Field name="lastName" placeholder="Last Name" className="input input-bordered w-full" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div>
                <Field name="email" type="email" placeholder="Email Address" className="input input-bordered w-full" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field name="password" type="password" placeholder="Password" className="input input-bordered w-full" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="space-y-2">
          <button className="btn w-full bg-white text-black border border-neutral-300 hover:border-neutral-500">
            <Image src="/Google.png" alt="Google" width={20} height={20} className="mr-2" />
            Sign up with Google
          </button>
          <button className="btn w-full bg-white text-black border border-neutral-300 hover:border-neutral-500">
            <Image src="/Facebook.png" alt="Facebook" width={20} height={20} className="mr-2" />
            Sign up with Facebook
          </button>
          <button className="btn w-full bg-white text-black border border-neutral-300 hover:border-neutral-500">
            <Image src="/discord_symbol.png" alt="Discord" width={20} height={20} className="mr-2" />
            Sign up with Discord
          </button>
        </div>
      </div>

      <div className="hidden md:block relative">
        <Image
          src="/SignupImage.png"
          alt="Signup Visual"
          layout="fill"
          objectFit="cover"
          className="brightness-90"
        />
      </div>
    </div>
  );
}
