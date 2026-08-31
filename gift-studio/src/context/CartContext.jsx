import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Step A: Reducer function - decides HOW state changes for each action
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        // agar product already cart mein hai, quantity badhao
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // naya product, quantity 1 se add karo
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

  // Page load hote hi localStorage se purana cart load karo
  useEffect(() => {
    const saved = localStorage.getItem("gift-cart");
    if (saved) {
      dispatch({ type: "LOAD_CART", cart: JSON.parse(saved) });
    }
  }, []);

  // Jab bhi cart change ho, localStorage mein save karo
  useEffect(() => {
    localStorage.setItem("gift-cart", JSON.stringify(cart));
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
      value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}