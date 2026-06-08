"use client";
import AdminFilterBar from "@/components/admin/admin-filter-bar";
import ProductAdminCard from "@/components/admin/product-card";
import ProductCreateModal from "@/components/admin/product-create-modal";
import { Column } from "@/components/layout/column";
import { Row } from "@/components/layout/row";
import { Button } from "@/components/ui/button";
import {
  GetAdminProductRequest,
  getAdminProducts,
} from "@/server-functions/products";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  const [filter, setFilter] = useState<GetAdminProductRequest>({
    brand: undefined,
    category: undefined,
    published: undefined,
    name: "",
    gender: "",
  });

  const { data: products } = useQuery({
    queryKey: ["admin_products", filter],
    queryFn: () => getAdminProducts(filter),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full space-y-4">
      <h1 className="font-heading text-2xl font-bold">Meus Produtos</h1>
      <Column className="flex-col-reverse md:flex-row justify-between">
        <AdminFilterBar
          filter={filter}
          setFilter={setFilter}
          total={products?.length ?? 0}
        />
        <Row className="justify-end">
          <Button variant="outline" asChild>
            <Link href="/admin/marcas" className="flex-1">
              Gerir Marcas
            </Link>
          </Button>

          <ProductCreateModal />
        </Row>
      </Column>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {products?.map((p) => (
          <ProductAdminCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
