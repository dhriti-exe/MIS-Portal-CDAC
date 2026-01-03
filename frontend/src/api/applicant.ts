import apiClient from './client'

export interface ApplicantProfile {
  applicant_id: number
  first_name: string
  middle_name: string
  last_name: string
  father_name: string
  gender: string
  dob: string
  caste_id: number
  address: string
  state_id: number
  district_id: number
  pin_code: number
  college_id: number
  other_college?: string | null
  email_id: string
  mobile_no: string
  profile_photo?: string | null
  active_status: string
}

export interface ApplicantCreate {
  first_name: string
  middle_name: string
  last_name: string
  father_name: string
  gender: 'M' | 'F' | 'O'
  dob: string
  caste_id: number
  address: string
  state_id: number
  district_id: number
  pin_code: number
  college_id: number
  other_college?: string
  email_id: string
  mobile_no: string
  profile_photo?: string
}

export interface Application {
  application_id: number
  session_name: string
  center_name: string
  application_status: string
  payment_status: string
  certificate_status: string
  updated_date: string
  reg_id: string | null
}

export interface NewsItem {
  news_id: number
  news_title: string
  news_desc: string
  category_name: string
  start_datetime: string
  end_datetime: string
  status: string
}

export interface Session {
  session_id: number
  session_name: string
  session_desc: string
  start_date: string
  end_date: string
  center_id: number
  active_status: string
}

export interface ApplicationCreate {
  session_id: number
  enroll_id: number;
  qualification_id: number
  stream_id: number
  marks: string
  dob_image?: string
  marksheet_image?: string
  role_id?: number
}

export const applicantAPI = {
  createProfile: async (data: ApplicantCreate): Promise<ApplicantProfile> => {
    const response = await apiClient.post<ApplicantProfile>('/applicant/profile', data)
    return response.data
  },
  getProfile: async (): Promise<ApplicantProfile> => {
    const response = await apiClient.get<ApplicantProfile>('/applicant/profile')
    return response.data
  },
  updateProfile: async (data: Partial<ApplicantCreate>): Promise<ApplicantProfile> => {
    const response = await apiClient.put<ApplicantProfile>('/applicant/profile', data)
    return response.data
  },
  getApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>('/applicant/applications')
    return response.data
  },
  getNews: async (): Promise<NewsItem[]> => {
    const response = await apiClient.get<NewsItem[]>('/applicant/news')
    return response.data
  },
  getSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/applicant/sessions')
    return response.data
  },
  createApplication: async (data: ApplicationCreate): Promise<Application> => {
    const response = await apiClient.post<Application>('/applicant/applications', data)
    return response.data
  },
  uploadProfilePhoto: async (file: File): Promise<ApplicantProfile> => {
    const formData = new FormData()
    formData.append('profile_photo', file)
    const response = await apiClient.patch<ApplicantProfile>('/applicant/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

