export interface AppUser {
    id: string;
    username: string;
    email: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: User;
    token: string; 
  }