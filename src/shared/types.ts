export interface FullServiceDto {
    id: number;
    title: string;
    description: string;
    price: number
    createdAt: Date;
    category: {
        id: number;
        name:string;
    };
    user: {
        id: number,
        firstName: string,
        lastName: string,
    },
    profile:FullProfileDto;
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
  companyName: null,
  firstName: string,
  lastName: string,
  user:{
        id: number;
        firstName: string,
        lastName: string,
        phone: string,

  };
  servicesCount: number;
  averageRating: number;
}


// export interface FullProfileDto {
//   id: number;
//   city: string;
//   address: string;
//   description: string;
//   image: string;
//   //servicesCount: number;
//   averageRating: number;
//   user:{
//         id: number;
//   };
// }

// export interface FullCompanyDto extends FullProfileDto {
//   companyName: string;
//   //verified: boolean;
// }

// export interface FullFreelancerDto extends FullProfileDto {
//   firstName: string;
//   lastName: string;
// }

// export type Profile = FullCompanyDto | FullFreelancerDto; //union tip (za elemente niza) - omogucava da niz sadrzi elemente razlicitih tipova


export interface FullReviewDto {
  id: number;
  rating: number;
  comment: string;
  createdAt:Date;
  profileId: number;
  user:{
    id: number;
    firstName: string;
    lastName: string;
  }
  service:{
    id: number;
    title: string;
    // user: {
    //   id: number;
    //   firstName: string;
    //   lastName: string;
    // }
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
  profile:FullProfileDto;
}

export interface  FullAvailabilityDto {
  id:number;
  employee:{
    id:number;
    firstname:string;
    lastname:string;
    description:string;
    profile:FullProfileDto;
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