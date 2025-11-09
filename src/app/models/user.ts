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
  userEmploymentStatus?: string | null;
  userPrefferedJob?: string | null;
  userSecondPrefferedJob?: string | null;
  userPrefferedJobLocation?: string | null;
  userSecondPrefferedJobLocation?: string | null;
  userTellAboutYourSelf?: string | null;
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
  userEmploymentStatus: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserExperience {
  UserExperienceId: number;
  userExperience: string;
}

export interface ProfileUpdatePayload {
  userName: string;
  userSurname: string;
  userAge: number;
  userGender: string;
  userPhoneNumber: string;
  userCitizenship: string;
  userPrefferedJob?: string | null;
  userSecondPrefferedJob?: string | null;
  userPrefferedJobLocation?: string | null;
  userSecondPrefferedJobLocation?: string | null;
  userTellAboutYourSelf?: string | null;
}