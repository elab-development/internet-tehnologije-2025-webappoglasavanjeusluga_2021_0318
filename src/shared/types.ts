export interface FullServiceDto {
    id: number;
    title: string;
    description: string;
    price: number
    createdAt: Date;
    category: {
        id: number;
    };
    user:{
        id: number;
    };
    profile:Profile
    
    
}

export interface FullCategoryDto {
    id: number;
    name: string;
    icon: string;
}

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
  //servicesCount: number;
  averageRating: number;
  user:{
        id: number;
  };
}

export interface FullCompanyDto extends FullProfileDto {
  companyName: string;
  //verified: boolean;
}

export interface FullFreelancerDto extends FullProfileDto {
  firstName: string;
  lastName: string;
}

export type Profile = FullCompanyDto | FullFreelancerDto; //union tip (za elemente niza) - omogucava da niz sadrzi elemente razlicitih tipova


export interface FullReviewDto {
  id: number;
  rating: number;
  comment: string;
  createdAt:Date;
  user:{
    id: number;
    firstName: string;
    lastName: string;
  }
  service:{
    id: number;
    title: string;
    user: {
      id:number;
    }
  }
}

export interface FullAppointmentDto {
  id: number;
  date:Date;
  time:string;
  isBooked:boolean;
  service:{
    id:number;
    user:{
        id: number;
    };
  }
}

export interface FullEmployeeDto {
  id:number;
  firstname:string;
  lastname:string;
  description:string;
  // user:{
  //   id:number;
  // }
  profile:Profile;
}

export interface  FullAvailabilityDto {
  id:number;
  employee:{
    id:number;
    firstname:string;
    lastname:string;
    description:string;
    profile:Profile;
    }
  appointment:{
    id: number;
    date:Date;
    time:string;
    isBooked:boolean;
    service:{
        id:number;
        user:{
            id: number;
        };
      }
    }
    note:string;
}