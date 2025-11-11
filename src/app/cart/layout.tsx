import { NavWithCart } from "@/src/app/cart/components/NavWithCart";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavWithCart />
        <main>{children}</main>
      </body>
    </html>
  );
}
