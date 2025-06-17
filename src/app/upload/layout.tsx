interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return <section className="flex w-full flex-col">{children}</section>;
};

export default Layout;
