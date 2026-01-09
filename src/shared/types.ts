export interface FullServiceDto {
    id: number;
    title: string;
    description: string;
    price: number
    createdAt: Date;
    category: {
        id: number;
        name: string;
    };
    
}

export interface FullCategoryDto {
    id: number;
    name: string;
    icon: string;
}