export interface UserProfile {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
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
  isAdmin?: boolean;
  cv_s3_key?: string | null;
  cv_original_name?: string | null;
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
  isAdmin?: boolean;
}

export interface FastSignUpPayload {
  userEmail: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserExperience {
  id: number;
  description: string;
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

export interface Job {
  id: number;
  title: string;
  company_name?: string;
  reference_code?: string;
  country: string;
  city?: string;
  workplace_address?: string;
  category: string;
  employment_type?: string;
  shift_type?: string;
  salary_from?: number;
  salary_to?: number;
  currency?: string;  
  salary_type?: string;
  is_net?: boolean;
  housing_provided?: boolean;
  transport_provided?: boolean;
  housing_details?: string;
  bonuses?: string;
  min_experience_years?: number;
  language_required?: string;
  documents_required?: string;
  driving_license_required?: boolean;
  short_description: string;
  full_description?: string;
  responsibilities?: string;
  requirements_text?: string;
  benefits_text?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  image: string;
}

export interface CvUploadResponse {
  url: string;
  original_name: string;
}