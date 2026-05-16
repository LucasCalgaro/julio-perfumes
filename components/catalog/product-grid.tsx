'use client' 
import { motion } from "framer-motion";
import EmptyState from "./empty-state";
import { BrandDTO, CategoryDTO, ProductDTO } from "@/lib/dtos";
import ProductCard from "./product-card";

export default function ProductGrid({ products, brands, categories }: { products: ProductDTO[], brands: BrandDTO[], categories: CategoryDTO[] }) {
  if (!products.length) {
    return <EmptyState message="Nenhum perfume encontrado com esses filtros." />;
  }

  const getBrandName = (id: number) => brands.find((b) => b.id === id)?.name || "";
  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || "";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <ProductCard
            product={p}
            brandName={getBrandName(p.brandId)}
            categoryName={getCategoryName(p.categoryId)}
          />
        </motion.div>
      ))}
    </div>
  );
}