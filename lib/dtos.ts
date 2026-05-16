export interface ProductDTO {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
    priceInCents: number;
    gender: string;
    categoryId: number;
    brandId: number;    
    
}

export interface CategoryDTO {
    id: number;
    name: string;
    slug: string;
}

export interface BrandDTO {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
}
