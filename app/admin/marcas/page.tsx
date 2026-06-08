"use client";
import BrandAdminCard from "@/components/admin/brand-card";
import BrandForm from "@/components/admin/create-brand-form";
import { Row } from "@/components/layout/row";
import { Button } from "@/components/ui/button";
import { getBrands } from "@/server-functions/brands";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const BrandPage = () => {
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full space-y-4">
      <h1 className="font-heading text-2xl font-bold">Minhas Marcas</h1>
      <Row className="justify-end flex-1">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/admin">Gerir Produtos</Link>
        </Button>
        <BrandForm isExtended />
      </Row>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6">
        {brands?.map((p) => (
          <BrandAdminCard key={p.id} brand={p} />
        ))}
      </div>
    </main>
  );
};

export default BrandPage;
