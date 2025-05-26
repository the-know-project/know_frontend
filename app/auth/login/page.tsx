"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { mainUser } from "../../../redux/slice/authSlice";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const SignupSchema = Yup.object().shape({
  
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password too short")
    .required("Password is required"),
});

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const userData = {
      ...values,
      username: values.email.split("@")[0],
     
    };

    try {
      const res = await fetch(
        "https://know-api-4vwfv.ondigitalocean.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) throw new Error("Failed to Login");

      const data = await res.json();
     if (res.ok && data.status === 200){
        const {accessToken, refreshToken} = data.data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        router.push("/explore")
       
        return data.data

     } 
     else{
        throw new Error(data.message || "Login Failed")
     } 

     } catch (err: any) {
        console.log("Login Error:", err.message);
        throw err
     }
      
     
     finally {
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
            <Link href="/login" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-1">Login</h1>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Login In..." : "Login"}
              </button>
            </form>
          )}
        </Formik>

        <div className="space-y-3 pt-4">
          {[
            { label: "Sign in with Google", icon: "/Google.png" },
            { label: "Sign in with Facebook", icon: "/Facebook.png" },
            { label: "Sign in with Discord", icon: "/discord_symbol.png" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className="btn w-full bg-white text-black border border-neutral-300 hover:border-neutral-500 flex items-center justify-center gap-3 py-2"
            >
              <Image src={icon} alt={label} width={20} height={20} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
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
