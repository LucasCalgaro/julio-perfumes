"use client";
import { GetProductsResponse } from "@/server-functions/products";
import { motion } from "framer-motion";
import EmptyState from "./empty-state";
import ProductCard from "./product-card";

export default function ProductGrid({
  products,
}: {
  products: GetProductsResponse[];
}) {
  if (!products.length) {
    return (
      <EmptyState message="Nenhum perfume encontrado com esses filtros." />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </div>
  );
}
