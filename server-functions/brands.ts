"use server";

import db from "@/db";
import { brandsTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GetBrandResponse = typeof brandsTable.$inferSelect;

export async function getBrands() {
  const brands = await db.select().from(brandsTable);
  return brands;
}

export type UpsertBrandRequest = typeof brandsTable.$inferInsert;

export async function upsertBrand(brand: UpsertBrandRequest, id?: number) {
  if (id) {
    const updatedBrand = await db
      .update(brandsTable)
      .set(brand)
      .where(eq(brandsTable.id, id))
      .returning();
    return updatedBrand;
  }

  const createdBrand = await db.insert(brandsTable).values(brand).returning();
  return createdBrand;
}

export async function deleteBrand(id: number) {
  const deleteProducts = await db
    .delete(productsTable)
    .where(eq(productsTable.brandId, id));

  const deletedBrand = await db
    .delete(brandsTable)
    .where(eq(brandsTable.id, id))
    .returning();
  return deletedBrand;
}
