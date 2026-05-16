import { BrandDTO, CategoryDTO, ProductDTO } from "./dtos";

export const product1 :ProductDTO = {
 id: 1,
 name: "Product 1",
 slug: "product-1",
 imageUrl: "https://picsum.photos/seed/product-1/640",
 priceInCents: 100,
 gender: "Masculino",
 categoryId: 1,
 brandId: 1
}

export const product2 :ProductDTO = {
 id: 2,
 name: "Product 2",
 slug: "product-2",
 imageUrl: "https://picsum.photos/seed/product-2/640",
 priceInCents: 200,
 gender: "Feminino",
 categoryId: 2,
 brandId: 2
}

export const product3 :ProductDTO = {
 id: 3,
 name: "Product 3",
 slug: "product-3",
 imageUrl: "https://picsum.photos/seed/product-3/640",
 priceInCents: 300,
 gender: "Unisex",
 categoryId: 3,
 brandId: 3
}

export const brand1: BrandDTO = {
  id: 1,
  name: "Brand 1",
  slug: "brand-1",
  imageUrl: "https://picsum.photos/64"
}

export const brand2: BrandDTO = {
  id: 2,
  name: "Brand 2",
  slug: "brand-2",
  imageUrl: "https://picsum.photos/64"
}

export const brand3: BrandDTO = {
  id: 3,
  name: "Brand 3",
  slug: "brand-3",
  imageUrl: "https://picsum.photos/64"
}

export const category1: CategoryDTO = {
  id: 1,
  name: "Category 1",
  slug: "category-1"
}

export const category2: CategoryDTO = {
  id: 2,
  name: "Category 2",
  slug: "category-2"
}

export const category3: CategoryDTO = {
  id: 3,
  name: "Category 3",
  slug: "category-3"
}