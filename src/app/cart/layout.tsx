import { NavWithCart } from "@/src/app/cart/components/NavWithCart";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavWithCart />
      <div>{children}</div>
    </div>
  );
}
