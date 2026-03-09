export interface FullServiceDto {
    id: number;
    title: string;
    description: string;
    price: number
    image: string;
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

// export interface FullProfileDto {
//   id: number;
//   city: string;
//   address: string;
//   description: string;
//   image: string;
//   companyName: null,
//   firstName: string,
//   lastName: string,
//   user:{
//         id: number;
//         firstName: string,
//         lastName: string,
//         phone: string,
//         createdAt:Date,

//   };
//   servicesCount: number;
//   averageRating: number;
// }


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
  firstName:string;
  lastName:string;
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









export interface ServiceDetailsDto {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  createdAt: string; 

  category: {
    id: number;
    name: string;
  };

  profile: FullProfileDto & {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      phone: string;
      createdAt: string;
      role: "FREELANCER" | "COMPANY" | "USER";
    };
  };

  reviews: FullReviewDto[];

  appointments: FullAppointmentDto[];

  availabilities: FullAvailabilityDto[];

  employees: FullEmployeeDto[];
}


/********************************************* */

export interface Category {
  id: number;
  name: string;
  icon: string;
}



export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  description?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface Service {
  id: number;
  title: string;
}

export interface Booking {
  id: number;
  reservedDate: string;
  createdAt: string;
  time: string | null;
  finished: boolean;

  user?: User;
  service?: Service;
  employee?: Employee | null;
}



/**************************************** */

// @/shared/types.ts

/**
 * Osnovni tip za korisnika (User tabela)
 */
export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: "USER" | "FREELANCER" | "COMPANY";
  createdAt: string;
}

/**
 * Profil koji može biti ili Freelancer ili Kompanija
 */
export interface FullProfileDto {
  id: number;
  city: string;
  address: string;
  description?: string | null;
  image?: string | null;
  companyName?: string | null; // Popunjeno ako je COMPANY
  firstName?: string | null;   // Popunjeno ako je FREELANCER
  lastName?: string | null;    // Popunjeno ako je FREELANCER
  userId: number;
  user: UserDto; // Ugnežđeni podaci o korisniku (vlasniku profila)
}

/**
 * Tip za pojedinačnu recenziju
 */
export interface ReviewDto {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  userId: number;
  serviceId: number;
  profileId: number;
  user?: {
    firstName: string;
    lastName: string;
  };
  service?: {
    title: string;
  };
}

/**
 * Glavni DTO za detalje usluge (ServiceDetails)
 */
export interface ServiceDetailsDto {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
  categoryId: number;
  userId: number;
  profileId: number;

  // Relacije (Joins)
  category: {
    id: number;
    name: string;
  };
  
  // profile: FullProfileDto; // Sadrži sve podatke o pružaocu usluge
  
  // reviews: ReviewDto[]; // Lista svih recenzija za ovu uslugu
  
  // appointments: any[]; // Možeš definisati detaljnije ako zatreba
  // availabilities: any[]; // Možeš definisati detaljnije ako zatreba
}