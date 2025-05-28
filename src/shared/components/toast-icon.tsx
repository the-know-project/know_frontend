import Image from "next/image";

const ToastIcon = () => {
  return (
    <>
      <Image
        src="/Know-Logo.png"
        alt="know_logo"
        width={100}
        height={100}
        className="object-contain"
      />
    </>
  );
};

export default ToastIcon;
