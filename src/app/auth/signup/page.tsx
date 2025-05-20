'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import{useState} from "react";

export default function SignupForm() {


  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

   

   
    router.push("/explore");
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

       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="input input-bordered w-full" />
            <input type="text" placeholder="Last Name" className="input input-bordered w-full" />
          </div>
          <input type="email" placeholder="Email Address" className="input input-bordered w-full" />
          <input type="password" placeholder="Password" className="input input-bordered w-full" />
          <button  type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>
        </form>

        
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
