import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, CheckCircle2, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

function buildWhatsAppLink(order) {
  const lines = order.items.map((i) => {
    let s = `- ${i.name} x${i.quantity} (Rs ${i.price * i.quantity})`;
    if (i.customText) s += `\n  Text: ${i.customText}`;
    if (i.colorName) s += `\n  Colour: ${i.colorName}`;
    if (i.hasPhoto) s += `\n  Photo: will send in this chat`;
    return s;
  });

  const msg =
    `Hi! I placed an order on Tagged & Wrapped.\n\n` +
    `Order ID: ${order.orderId}\n` +
    `Name: ${order.name}\n` +
    `Phone: ${order.phone}\n\n` +
    `${lines.join("\n")}\n\n` +
    `Total: Rs ${order.total}`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

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

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // order confirm hone ke baad

  function handleClose() {
    setShowForm(false);
    setError("");
    setDone(null);
    onClose();
  }

  // Page scroll lock + Esc se band
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          items: cart.map((i) => ({
            productId: i.productId ?? i.id,
            quantity: i.quantity,
            customText: i.customText || "",
            colorName: i.colorName || "",
            hasPhoto: Boolean(i.hasPhoto),
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server replied with status ${res.status}`);

      setDone({
        orderId: data.orderId,
        total: data.total,
        name: name.trim(),
        phone,
        items: data.items.map((it) => ({
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          customText: it.customText,
          colorName: it.colorName,
          hasPhoto: it.hasPhoto,
        })),
      });
      clearCart();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Could not place the order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-green-900">
            {done ? "Order confirmed" : `Your cart (${totalItems})`}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SUCCESS SCREEN */}
        {done ? (
          <div className="flex-1 overflow-y-auto px-6 py-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-green-700 mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-green-900">Thank you, {done.name}!</h3>
            <p className="text-gray-600 mt-1">Your order has been saved.</p>
            <p className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-green-900 font-semibold">
              Order ID: {done.orderId}
            </p>
            <p className="mt-3 text-gray-600">Total: ₹{done.total}</p>

            {WA_NUMBER ? (
              <a
                href={buildWhatsAppLink(done)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4" />
                Send order on WhatsApp
              </a>
            ) : (
              <p className="mt-6 text-xs text-red-600">
                WhatsApp number not set (VITE_WHATSAPP_NUMBER).
              </p>
            )}
            <p className="mt-3 text-xs text-gray-500">
              Tap the button and press Send in WhatsApp to share your order details
              {done.items.some((i) => i.hasPhoto) ? ". Please send your photo in the same chat." : "."}
            </p>

            <button
              onClick={handleClose}
              className="mt-6 text-sm text-gray-600 underline hover:text-green-800"
            >
              Back to shop
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 px-6 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
            <p>Your cart is empty.</p>
            <button
              onClick={handleClose}
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

              {!showForm ? (
                <>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 rounded-full bg-green-800 text-white text-sm font-semibold hover:bg-green-900"
                  >
                    Place order
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-1 text-sm text-gray-500 hover:text-red-600"
                  >
                    Clear cart
                  </button>
                </>
              ) : (
                <form onSubmit={placeOrder} className="space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-800"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile number (10 digits)"
                    inputMode="numeric"
                    maxLength={13}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-800"
                  />
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-green-800 text-white text-sm font-semibold hover:bg-green-900 disabled:opacity-50"
                  >
                    {loading ? "Placing order..." : `Confirm order · ₹${totalPrice}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full py-1 text-sm text-gray-500 hover:text-green-800"
                  >
                    Back to cart
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}