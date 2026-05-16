import FilterBar from "@/components/catalog/filter-bar";
import ProductGrid from "@/components/catalog/product-grid";
import { brand1, brand2, brand3, category1, category2, category3, product1, product2, product3 } from "@/lib/mock-data";

export default function Home () {
  return (
    <main className="max-w-7xl mx-auto px-4 py-5 w-full">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight">
          Catálogo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          12 {"perfumes"} disponíveis
        </p>
      </div>
      <div className="mb-6">
        <FilterBar/>
      </div>
      <ProductGrid brands={[ brand1, brand2, brand3]} categories={[ category1, category2, category3 ]} products={[ product1, product2, product3, product1, product2, product3, product1, product2, product3 ]} />
    </main>
  );
}
