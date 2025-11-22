export interface AdminUser {
  userId: number;
  userEmail: string;
  userName?: string | null;
  userSurname?: string | null;
  userGender?: string | null;
  userAge?: number | null;
  userPhoneNumber?: string | null;
  userCitizenship?: string | null;
  userPrefferedJob?: string | null;
  userSecondPrefferedJob?: string | null;
  userPrefferedJobLocation?: string | null;
  userSecondPrefferedJobLocation?: string | null;
  userTellAboutYourSelf?: string | null;
  userEmploymentStatus?: string | null;
  is_admin?: boolean;
  cv_original_name?: string | null;
}


export interface AdminUserUpdate {
  userName?: string | null;
  userSurname?: string | null;
  userPhoneNumber?: string | null;
  userCitizenship?: string | null;
  userEmploymentStatus?: string | null;
  userGender?: string | null;
  userAge?: number | null;
  userPrefferedJob?: string | null;
  userSecondPrefferedJob?: string | null;
  userPrefferedJobLocation?: string | null;
  userSecondPrefferedJobLocation?: string | null;
  userTellAboutYourSelf?: string | null;
  is_admin?: boolean;
}

export interface AdminApplicationJob {
  id: number;
  status: string;
  created_at: string;
  job_id: number;
  job_title?: string | null;
  job_country?: string | null;
}

export interface AdminJob {
  id: number;
  title: string;
  company_name?: string | null;
  reference_code?: string | null;
  country: string;
  city?: string | null;
  workplace_address?: string | null;
  category?: string | null;
  employment_type?: string | null;
  shift_type?: string | null;
  salary_from?: number | null;
  salary_to?: number | null;
  currency?: string | null;
  salary_type?: string | null;
  is_net?: boolean | null;
  housing_provided?: boolean | null;
  housing_details?: string | null;
  transport_provided?: boolean | null;
  bonuses?: string | null;
  min_experience_years?: number | null;
  language_required?: string | null;
  documents_required?: string | null;
  driving_license_required?: boolean | null;
  short_description?: string | null;
  full_description?: string | null;
  responsibilities?: string | null;
  requirements_text?: string | null;
  benefits_text?: string | null;
  is_active: boolean;
  image?: string;
}

export interface AdminJobCreate {
  title: string;
  country: string;
  city?: string | null;
  company_name?: string | null;
  reference_code?: string | null;
  workplace_address?: string | null;
  category?: string | null;
  employment_type?: string | null;
  shift_type?: string | null;
  salary_from?: number | null;
  salary_to?: number | null;
  currency?: string | null;
  salary_type?: string | null;
  is_net?: boolean | null;
  housing_provided?: boolean | null;
  housing_details?: string | null;
  transport_provided?: boolean | null;
  bonuses?: string | null;
  min_experience_years?: number | null;
  language_required?: string | null;
  documents_required?: string | null;
  driving_license_required?: boolean | null;
  short_description?: string | null;
  full_description?: string | null;
  responsibilities?: string | null;
  requirements_text?: string | null;
  benefits_text?: string | null;
  is_active?: boolean | null; 
  image?: string;
}

export interface AdminJobUpdate extends Partial<AdminJobCreate> {
  is_active?: boolean | null;       // <— and here
}

export interface JobTranslation {
  id: number;
  job_id: number;
  lang_code: string;
  title?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  responsibilities?: string | null;
  requirements_text?: string | null;
  benefits_text?: string | null;
  housing_details?: string | null;
  documents_required?: string | null;
  bonuses?: string | null;
  language_required?: string | null;
}

export interface JobTranslationUpsert {
  lang_code: string;
  title?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  responsibilities?: string | null;
  requirements_text?: string | null;
  benefits_text?: string | null;
  housing_details?: string | null;
  documents_required?: string | null;
  bonuses?: string | null;
  language_required?: string | null;
}