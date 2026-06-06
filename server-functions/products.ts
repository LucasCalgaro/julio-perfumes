"use server";

import db from "@/db";
import { brandsTable, categoriesTable, productsTable } from "@/db/schema";
import { and, eq, getTableColumns, gt } from "drizzle-orm";

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
        gt(productsTable.stock, 0),
        eq(productsTable.isPublished, true),
      ),
    );
  return products;
}

export type GetProductResponse =
  | (typeof productsTable.$inferSelect & {
      brand: string;
      brandUrl: string | null;
      category: string;
    })
  | null;

export const getProductBySlug = async (
  slug: string,
): Promise<GetProductResponse> => {
  const product = await db
    .select({
      ...getTableColumns(productsTable),
      brand: brandsTable.name,
      brandUrl: brandsTable.imageUrl,
      category: categoriesTable.name,
    })
    .from(productsTable)
    .innerJoin(brandsTable, eq(brandsTable.id, productsTable.brandId))
    .innerJoin(
      categoriesTable,
      eq(categoriesTable.id, productsTable.categoryId),
    )
    .where(eq(productsTable.slug, slug))
    .limit(1);

  if (!product) {
    return null;
  }
  return product[0];
};

export type GetAdminProductRequest = {
  brand?: number;
  category?: number;
  gender: string;
};

export type GetAdminProductsResponse = typeof productsTable.$inferSelect & {
  id: number;
  brand: string;
  category: string;
};

export async function getAdminProducts(
  filter?: GetAdminProductRequest,
): Promise<GetAdminProductsResponse[]> {
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
    .where(and(genderFilter, brandFilter, categoryFilter));
  return products;
}

export type UpsertProductRequest = typeof productsTable.$inferInsert;

export async function upsertProduct({
  product,
  id,
}: {
  product: UpsertProductRequest;
  id?: number;
}) {
  if (id) {
    const { slug, ...rest } = product;
    const updatedProduct = await db
      .update(productsTable)
      .set(rest)
      .where(eq(productsTable.id, id))
      .returning();
    return updatedProduct;
  }

  const existingProduct = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, product.slug))
    .limit(1);

  if (existingProduct && existingProduct.length > 0) {
    const lastId = existingProduct[0].id;
    product.slug = `${product.slug}-${lastId + 1}`;
  }

  const createdProduct = await db
    .insert(productsTable)
    .values(product)
    .returning();

  return createdProduct;
}

export async function deleteProduct(id: number) {
  const deletedProduct = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();
  return deletedProduct;
}
