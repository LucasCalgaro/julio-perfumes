import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProductDTO } from "@/lib/dtos";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

interface GenderLabel {
  [key: string]: string;
}

const genderLabel: GenderLabel = {
  Masculino: "Masc.",
  Feminino: "Fem.",
  Unisex: "Unisex",
};

export default function ProductCard({ product, brandName, categoryName }: { product: ProductDTO, brandName: string, categoryName: string }) {
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 mb-3">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <Badge className="absolute top-2 left-2 text-[10px] font-medium bg-background/80 text-foreground backdrop-blur-sm py-1 px-4 rounded-full">
          {genderLabel[product.gender] || product.gender}
        </Badge>
      </div>
      <div className="space-y-1 px-0.5">
        <p className="text-[11px] uppercase tracking-wider text-primary font-medium">
          {brandName}
        </p>
        <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground">{categoryName}</p>
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(product.priceInCents)}
        </p>
      </div>
    </Link>
  );
}