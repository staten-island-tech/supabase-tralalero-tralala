export type AppUser = {
    id: string;
    email: string;
  }
  
  export type LoginRequest = {
    email: string;
    password: string;
  }
  
  export type LoginResponse = {
    user: AppUser;
    token: string;
  }