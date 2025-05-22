"use client";

interface ITemplate {
  children: React.ReactNode;
}

const Template: React.FC<ITemplate> = ({ children }) => {
  return (
    <div className="motion-preset-expand motion-duration-700">{children}</div>
  );
};

export default Template;
