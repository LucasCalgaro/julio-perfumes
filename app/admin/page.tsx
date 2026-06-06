"use client";
import ProductAdminCard from "@/components/admin/product-card";
import ProductCreateModal from "@/components/admin/product-create-modal";
import { Row } from "@/components/layout/row";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/server-functions/products";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function AdminPage() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAdminProducts(),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full space-y-4">
      <Row className="justify-end">
        <Button variant="outline" asChild>
          <Link href="/admin/marcas">Gerir Marcas</Link>
        </Button>
        <ProductCreateModal />
      </Row>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {products?.map((p) => (
          <ProductAdminCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
