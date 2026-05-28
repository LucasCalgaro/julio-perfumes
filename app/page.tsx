"use client";
import FilterBar from "@/components/catalog/filter-bar";
import ProductGrid from "@/components/catalog/product-grid";
import { Column } from "@/components/layout/column";
import { GetProductRequest, getProducts } from "@/server-functions/products";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState<GetProductRequest>({
    brand: undefined,
    category: undefined,
    gender: "",
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filter],
    queryFn: () => getProducts(filter),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full">
      <div className="mb-6">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          total={products?.length ?? 0}
        />
      </div>
      {isLoading ? (
        <Column className="w-full items-center justify-center gap-1">
          <Loader2 className="animate-spin w-10 h-10" /> Carregando
        </Column>
      ) : (
        <ProductGrid products={products ?? []} />
      )}
    </main>
  );
}
