"use server";

import db from "@/db";
import { categoriesTable } from "@/db/schema";

export async function getCategories() {
  const categories = await db.select().from(categoriesTable);
  return categories;
}
