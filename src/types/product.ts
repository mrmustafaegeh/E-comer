export interface Product {
    id: string;
    _id: string;
    name: string;
    title: string;
    description: string;
    price: number;
    formattedPrice: string;
    salePrice: number | null;
    formattedSalePrice: string | null;
    isOnSale: boolean;
    discount: string;
    category: string;
    slug: string;
    image: string;
    images?: string[];
    stock: number;
    isFeatured: boolean;
    rating: number;
    numReviews: number;
    createdAt: string | null;
    formattedDate: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
