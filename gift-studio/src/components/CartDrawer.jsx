import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Page scroll lock + Esc se band
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your cart">
      {/* Dark background, click karne par band */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Right side panel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-green-900">
            Your cart ({totalItems})
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 px-6 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
            <p>Your cart is empty.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-green-800 text-white text-sm hover:bg-green-900"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-100 px-5">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex gap-3">
                  <div className="w-16 h-16 shrink-0 rounded-lg bg-orange-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                    {item.thumb ? (
                      <img src={item.thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-orange-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold text-green-900 break-words">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">₹{item.price}</p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center border border-gray-300 rounded-full">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center hover:text-green-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center hover:text-green-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 shrink-0">
                    ₹{item.price * item.quantity}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-green-900">₹{totalPrice}</span>
              </div>
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-gray-500 hover:text-red-600"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}