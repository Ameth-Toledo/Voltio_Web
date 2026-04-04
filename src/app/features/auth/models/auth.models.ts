export interface UserResponse {
  id: number;
  name: string;
  secondname: string | null;
  lastname: string;
  secondlastname: string | null;
  email: string;
  phone: string | null;
  image_profile: string | null;
  role: 'user' | 'admin' | 'repartidor';
  account_type: 'person' | 'company';
  firebase_token: string | null;
  created_at: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}