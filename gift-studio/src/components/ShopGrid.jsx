import { useState } from "react";
import { Camera, Type } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductImage from "./ProductImage";
import CustomizeModal from "./CustomizeModal";
import { CATEGORIES } from "../data/products";

function CustomHint({ product }) {
  const mode = product.custom.photo;
  const label =
    mode === "required" ? "Photo required" : mode === "optional" ? "Photo + text" : "Text only";
  const Icon = mode === "none" ? Type : Camera;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-green-800 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function ShopGrid({ products, loading, error, onRetry, customizeId, onCustomize }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { cart, totalItems, totalPrice } = useCart();

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const selected = products.find((p) => p.id === customizeId) || null;

  // Counts every version of this product in the cart (plain or customized)
  function qtyInCart(productId) {
    return cart
      .filter((i) => (i.productId ?? i.id) === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  }

  return (
    <section id="shop" className="max-w-6xl mx-auto px-5 py-16">
      <h2 className="text-3xl font-bold text-green-900 mb-2">Shop &amp; customize</h2>
      <p className="text-gray-600 mb-8">
        Pick a piece and make it yours. Every product can be personalized with your own text,
        colour and photo.
      </p>

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

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-44 rounded-lg mb-4 bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-4 w-40 rounded bg-gray-100 mt-3" />
              <div className="h-9 rounded-full bg-gray-100 mt-6" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 text-center">
          <p className="text-gray-700">{error}</p>
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2.5 rounded-full bg-green-800 text-white text-sm hover:bg-green-900 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500">No products in this category yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const qty = qtyInCart(product.id);
          return (
            <div
              key={product.id}
              className="group border border-gray-200 rounded-xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <button
                onClick={() => onCustomize(product.id)}
                aria-label={`Customize ${product.name}`}
                className="relative block w-full h-44 rounded-lg mb-4 overflow-hidden bg-orange-50"
              >
                <ProductImage category={product.category} name={product.name} />
                <span className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <span className="bg-white/95 text-green-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                    Customize →
                  </span>
                </span>
              </button>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {product.category}
                </p>
                <CustomHint product={product} />
              </div>
              <h3 className="font-semibold text-green-900 mt-1">{product.name}</h3>
              <p className="text-gray-600 mt-1">₹{product.price}</p>
              <button
                onClick={() => onCustomize(product.id)}
                className="mt-4 w-full py-2 bg-green-800 text-white rounded-full text-sm hover:bg-green-900 transition-colors"
              >
                Customize &amp; add
              </button>
              {qty > 0 && (
                <p className="mt-2 text-xs text-green-700 text-center">In your cart: {qty}</p>
              )}
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="mt-8 text-sm text-gray-600">
          <p>
            {totalItems} item(s) in cart, Total: ₹{totalPrice}
          </p>
        </div>
      )}

      {selected && (
        <CustomizeModal
          key={selected.id}
          product={selected}
          onClose={() => onCustomize(null)}
        />
      )}
    </section>
  );
}