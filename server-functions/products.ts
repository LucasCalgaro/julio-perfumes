"use server";

import db from "@/db";
import { brandsTable, categoriesTable, productsTable } from "@/db/schema";
import { and, eq, getTableColumns } from "drizzle-orm";

export type GetProductRequest = {
  brand?: number;
  category?: number;
  gender: string;
};

export type GetProductsResponse = typeof productsTable.$inferSelect & {
  brand: string;
  category: string;
};

export async function getProducts(
  filter?: GetProductRequest,
): Promise<GetProductsResponse[]> {
  let genderFilter;

  if (filter?.gender) {
    genderFilter = eq(productsTable.gender, filter.gender);
  }

  let brandFilter;

  if (filter?.brand) {
    brandFilter = eq(productsTable.brandId, Number(filter.brand));
  }

  let categoryFilter;

  if (filter?.category) {
    categoryFilter = eq(productsTable.categoryId, Number(filter.category));
  }

  const products = await db
    .select({
      ...getTableColumns(productsTable),
      brand: brandsTable.name,
      category: categoriesTable.name,
    })
    .from(productsTable)
    .innerJoin(brandsTable, eq(brandsTable.id, productsTable.brandId))
    .innerJoin(
      categoriesTable,
      eq(categoriesTable.id, productsTable.categoryId),
    )
    .where(
      and(
        genderFilter,
        brandFilter,
        categoryFilter,
        eq(productsTable.isPublished, true),
      ),
    );
  return products;
}
