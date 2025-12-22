interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <section className="flex w-full flex-col">
      <section className="flex min-h-screen w-full flex-col">
        {children}
      </section>
    </section>
  );
};

export default Layout;
