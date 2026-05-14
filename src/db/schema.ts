import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  resetToken: varchar({ length: 255 }).unique(),
});

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  gender: varchar({ length: 255 }).notNull(),
  categoryId: integer().notNull().references(() => categoriesTable.id),
  brandId: integer().notNull().references(() => brandsTable.id),
  description: varchar({ length: 255 }),
  priceInCents: integer().notNull().default(0),
  imageUrl: varchar({ length: 255 }),
  stock: integer().notNull().default(0),
  isPublished: boolean().notNull().default(true),
  fragranticaUrl: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
});


export const brandsTable = pgTable("brands", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  imageUrl: varchar({ length: 255 }),
});
