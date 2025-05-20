// components/Header.tsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black shadow-md">
      <div className="text-xl font-bold text-primary">
        <Image src="/Know-Logo.png"  alt="logo" width={50} height={50} priority/>
      </div>

      <nav className="hidden md:flex gap-6 text-sm text-white font-medium">
        <Link href="#">About Us</Link>
        <Link href="#">Community</Link>
        <Link href="#">Contact Us</Link>
      </nav>

      <Link href="/auth">
        <button className="btn btn-primary btn-sm">Get Started</button>
      </Link>
    </header>
  );
}
