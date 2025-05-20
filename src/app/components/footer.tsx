import {
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
  } from "react-icons/fa6"; // latest icon pack
  import Image from "next/image";
  
  export default function Footer() {
    return (
      <footer className="bg-base-200 text-base-content px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/Know-Logo.png" alt="Logo" width={30} height={30} />
          </div>
  
          {/* Links */}
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="#" className="link link-hover">About Us</a>
            <a href="#" className="link link-hover">Community</a>
            <a href="#" className="link link-hover">Contact Us</a>
          </div>
  
          {/* Social Icons */}
          <div className="flex gap-4 text-lg">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
  
        <div className="text-center text-xs mt-6 text-neutral-400">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    );
  }
  