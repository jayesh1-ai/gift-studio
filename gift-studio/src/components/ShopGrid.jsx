import { useState } from "react";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  { id: 1, name: "Engraved Wooden Photo Frame", price: 899, category: "Home" },
  { id: 2, name: "Custom Name Necklace", price: 1299, category: "Jewelry" },
  { id: 3, name: "Personalized Mug", price: 449, category: "Home" },
  { id: 4, name: "Monogram Leather Wallet", price: 1599, category: "Accessories" },
  { id: 5, name: "Custom Birthday Card", price: 199, category: "Cards" },
  { id: 6, name: "Photo Collage Puzzle", price: 799, category: "Home" },
];

const CATEGORIES = ["All", "Home", "Jewelry", "Accessories", "Cards"];

export default function ShopGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { cart, addToCart } = useCart();

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="shop" className="max-w-6xl mx-auto px-5 py-16">
      <h2 className="text-3xl font-bold text-green-900 mb-2">Shop the collection</h2>
      <p className="text-gray-600 mb-8">Pick a piece, then make it yours.</p>

      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={
              "px-4 py-2 rounded-full text-sm border transition-colors " +
              (activeCategory === cat
                ? "bg-green-800 text-white border-green-800"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-800")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="h-40 bg-orange-50 rounded-lg mb-4 flex items-center justify-center text-orange-300 text-sm">
              Product image
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400">{product.category}</p>
            <h3 className="font-semibold text-green-900 mt-1">{product.name}</h3>
            <p className="text-gray-600 mt-1">₹{product.price}</p>
            <button onClick={() => addToCart(product)} className="mt-4 w-full py-2 bg-green-800 text-white rounded-full text-sm hover:bg-green-900 transition-colors">
              Add to cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <p className="mt-8 text-sm text-gray-500">{cart.length} item(s) in cart</p>
      )}
    </section>
  );
}