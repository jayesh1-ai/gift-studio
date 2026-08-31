import { useState } from "react";
import { Menu, X, ShoppingBag, Gift } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  const links = [
    { label: "Shop", href: "#shop" },
    { label: "How it works", href: "#how" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-xl text-green-800">
          <Gift className="w-5 h-5" />
          Tagged & Wrapped
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-orange-600 transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gray-300">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button className="md:hidden w-10 h-10 flex items-center justify-center" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="md:hidden flex flex-col px-5 pb-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="block py-3 border-b border-gray-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}