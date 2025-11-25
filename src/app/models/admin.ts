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

  isAdmin?: boolean;
  is_admin?: boolean;

  cv_original_name?: string | null;

  candidateId?: number | null;

  experiences?: { id: number; experience: string }[];
  applications_count?: number;
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

// --- Companies ---

export interface AdminCompany {
  id: number;
  name: string;

  hr_contact_name?: string | null;
  hr_contact_email?: string | null;
  hr_contact_phone?: string | null;

  country?: string | null;
  city?: string | null;
  address?: string | null;

  status: string;
  notes?: string | null;

  open_positions_count?: number | null;

  created_at: string;
  updated_at: string;
}

export interface AdminCompanyCreate {
  name: string;

  hr_contact_name?: string | null;
  hr_contact_email?: string | null;
  hr_contact_phone?: string | null;

  country?: string | null;
  city?: string | null;
  address?: string | null;

  status?: string | null;   // "active" по умолчанию на бэке
  notes?: string | null;
}

export interface AdminCompanyUpdate {
  name?: string | null;

  hr_contact_name?: string | null;
  hr_contact_email?: string | null;
  hr_contact_phone?: string | null;

  country?: string | null;
  city?: string | null;
  address?: string | null;

  status?: string | null;
  notes?: string | null;
}


// --- Company jobs (вакансии клиента) ---

export interface AdminCompanyJob {
  id: number;
  company_id: number;
  title: string;
  short_description?: string | null;

  country?: string | null;
  city?: string | null;

  requirements?: string | null;

  is_active: boolean;
  open_slots?: number | null;
  filled_slots?: number | null;

  created_at: string;
  updated_at: string;
}

export interface AdminCompanyJobCreate {
  title: string;
  short_description?: string | null;

  country?: string | null;
  city?: string | null;

  requirements?: string | null;

  is_active?: boolean | null;
  open_slots?: number | null;
}

export interface AdminCompanyJobUpdate {
  title?: string | null;
  short_description?: string | null;

  country?: string | null;
  city?: string | null;

  requirements?: string | null;

  is_active?: boolean | null;
  open_slots?: number | null;
  filled_slots?: number | null;
}


// --- Placements (трудоустройство кандидатов) ---

export interface AdminPlacement {
  id: number;
  candidate_id: number;
  company_id: number;

  company_job_id?: number | null;
  job_id?: number | null;
  recruiter_id?: number | null;

  status: string;
  start_date?: string | null;
  end_date?: string | null;

  salary_offer?: number | null;
  salary_currency?: string | null;

  rating?: number | null;

  company_feedback?: string | null;
  internal_notes?: string | null;

  created_at: string;
  updated_at: string;
}

// с удобными текстами для UI
export interface AdminPlacementDetailed extends AdminPlacement {
  candidate_name?: string | null;
  company_name?: string | null;
  company_job_title?: string | null;
  job_title?: string | null;
  recruiter_email?: string | null;
}

export interface AdminPlacementCreate {
  candidate_id: number; 
  company_id?: number | null;
  company_job_id?: number | null;
  job_id?: number | null;
  recruiter_id?: number | null;

  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;

  salary_offer?: number | null;
  salary_currency?: string | null;

  rating?: number | null;
  company_feedback?: string | null;
  internal_notes?: string | null;
}

export interface AdminPlacementUpdate {
  candidate_id: number; 
  company_id?: number | null;
  company_job_id?: number | null;
  job_id?: number | null;
  recruiter_id?: number | null;

  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;

  salary_offer?: number | null;
  salary_currency?: string | null;

  rating?: number | null;
  company_feedback?: string | null;
  internal_notes?: string | null;
}
