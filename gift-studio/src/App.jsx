import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShopGrid from "./components/ShopGrid";
import GiftFinder from "./components/GiftFinder";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import useProducts from "./hooks/useProducts";

function App() {
  // Which product's customizer is open (null = closed). Shared by the shop and the gift finder.
  const [customizeId, setCustomizeId] = useState(null);

  // Cart panel open/closed
  const [cartOpen, setCartOpen] = useState(false);

  // Products come from the backend API (MongoDB)
  const { products, loading, error, retry } = useProducts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <Hero />
      <ShopGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={retry}
        customizeId={customizeId}
        onCustomize={setCustomizeId}
      />
      <GiftFinder products={products} onCustomize={setCustomizeId} />
      <HowItWorks />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;