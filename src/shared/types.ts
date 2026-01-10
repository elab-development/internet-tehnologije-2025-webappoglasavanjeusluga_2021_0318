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

//********************************** */

export enum FullRoleDto {
  USER = "USER",
  COMPANY = "COMPANY",
  FREELANCER = "FREELANCER",
}

export interface FullUserDto{
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: FullRoleDto;
    createdAt:Date;
}

export interface FullProfileDto {
  id: number;
  city: string;
  address: string;
  description: string;
  image: string;
  phone: string;
  createdAt: Date;
  servicesCount: number;
  averageRating: number;
  user:{
        id: number;
  };
}

export interface FullCompanyDto extends FullProfileDto {
  companyName: string;
  verified: boolean;
}

export interface FullFreelancerDto extends FullProfileDto {
  firstName: string;
  lastName: string;
}
