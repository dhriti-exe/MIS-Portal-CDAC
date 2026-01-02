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
  enrollment_title: string
  center_name: string
  session_name: string
  application_status: string
  payment_status: string
  certificate_status: string
  updated_date: string
  reg_id: string | null
}

export interface Enrollment {
  enroll_id: number
  enroll_title: string
  enroll_desc: string
  enroll_start_date: string
  enroll_end_date: string
  center_name: string
  session_name: string
  active_status: string
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
  getEnrollments: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>('/applicant/enrollments')
    return response.data
  },
  getNews: async (): Promise<NewsItem[]> => {
    const response = await apiClient.get<NewsItem[]>('/applicant/news')
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

