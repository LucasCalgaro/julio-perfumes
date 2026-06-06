"use client";
import AdminFilterBar from "@/components/admin/admin-filter-bar";
import ProductAdminCard from "@/components/admin/product-card";
import ProductCreateModal from "@/components/admin/product-create-modal";
import FilterBar from "@/components/catalog/filter-bar";
import { Row } from "@/components/layout/row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GetAdminProductRequest,
  getAdminProducts,
} from "@/server-functions/products";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  const [filter, setFilter] = useState<GetAdminProductRequest>({
    name: undefined,
    brand: undefined,
    category: undefined,
    gender: "",
  });
  const { data: products } = useQuery({
    queryKey: ["products", filter],
    queryFn: () => getAdminProducts(filter),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full space-y-4">
      <Row className="justify-between">
        <AdminFilterBar
          filter={filter}
          setFilter={setFilter}
          total={products?.length ?? 0}
        />
        <Row>
          <Button variant="outline" asChild>
            <Link href="/admin/marcas">Gerir Marcas</Link>
          </Button>
          <ProductCreateModal />
        </Row>
      </Row>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {products?.map((p) => (
          <ProductAdminCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
