"use server";

import db from "@/db";
import { brandsTable } from "@/db/schema";

export async function getBrands() {
  const brands = await db.select().from(brandsTable);
  return brands;
}
