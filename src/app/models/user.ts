export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

export interface UserOut {
  userId: number;
  userEmail: string;
  userName?: string | null;
  userSurname?: string | null;
  userAge?: number | null;
  userGender?: string | null;
  userPhoneNumber?: string | null;
  userCitizenship?: string | null;
}

export interface SignUpPayload {
  userEmail: string;
  password: string;
  userName?: string;
  userSurname?: string;
  userAge?: number;
  userGender?: string;
  userPhoneNumber?: string;
  userCitizenship?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}