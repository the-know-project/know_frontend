import React from "react";

interface IToastDescription {
  description: string;
}

const ToastDescription: React.FC<IToastDescription> = ({ description }) => {
  return (
    <p className="font-bebas text-normal tracking-wider text-white">
      {description}
    </p>
  );
};

export default ToastDescription;
