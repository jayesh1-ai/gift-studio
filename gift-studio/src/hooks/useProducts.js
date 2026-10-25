import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api";

// Custom hook: loads the product list from the backend API
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((data) => setProducts(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("We could not load the products. Please check that the server is running.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Cancel the request if the page is closed before it finishes
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1);
  }, []);

  return { products, loading, error, retry };
}