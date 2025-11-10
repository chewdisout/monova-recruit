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

export interface Job {
  id: number;

  // Core
  title: string;
  company_name?: string;

  // Location
  country: string;         // 'DE', 'NL', etc.
  city?: string;

  // Classification
  category: string;        // 'logistics', 'production', etc.
  employment_type?: string; // 'full-time', 'seasonal', etc.
  shift_type?: string;      // 'day', 'night', 'rotation', etc.

  // Salary
  salary_from?: number;
  salary_to?: number;
  currency?: string;        // 'EUR'
  salary_type?: string;     // 'hourly', 'monthly'
  is_net?: boolean;

  // Benefits / flags
  housing_provided?: boolean;
  transport_provided?: boolean;

  // Text fields
  short_description: string;
  full_description?: string;
  requirements_text?: string;
  benefits_text?: string;

  // Control (optional for FE)
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
