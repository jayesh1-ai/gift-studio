import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }

    case "INCREASE_QTY":
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );

    case "DECREASE_QTY":
      return state
        .map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.id);

    case "CLEAR_CART":
      return [];

    case "LOAD_CART":
      return action.cart;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load the saved cart when the page opens
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gift-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) dispatch({ type: "LOAD_CART", cart: parsed });
      }
    } catch (err) {
      console.warn("Could not load saved cart:", err);
    }
  }, []);

  // Save the cart whenever it changes (never crash if storage is full)
  useEffect(() => {
    try {
      localStorage.setItem("gift-cart", JSON.stringify(cart));
    } catch (err) {
      console.warn("Could not save cart:", err);
    }
  }, [cart]);

  const addToCart = (product) => dispatch({ type: "ADD_ITEM", product });
  const increaseQty = (id) => dispatch({ type: "INCREASE_QTY", id });
  const decreaseQty = (id) => dispatch({ type: "DECREASE_QTY", id });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}