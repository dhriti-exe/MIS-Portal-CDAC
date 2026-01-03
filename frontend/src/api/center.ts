import apiClient from './client'

export interface CenterProfile {
  center_id: number
  center_name: string
  state_id: number
  district_id: number
  center_code?: string | null
  center_address?: string | null
  center_phone?: string | null
  center_mail_id?: string | null
  center_pay_link?: string | null
  center_venue?: string | null
}

export interface CenterCreate {
  center_name: string
  state_id: number
  district_id: number
  center_code?: string
  center_address?: string
  center_phone?: string
  center_mail_id?: string
  center_pay_link?: string
  center_venue?: string
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

export interface SessionCreate {
  session_name: string
  session_desc: string
  start_date: string
  end_date: string
  active_status?: string
}

export interface Application {
  application_id: number
  applicant_name: string
  applicant_email: string
  session_name: string
  application_status: string
  payment_status: string
  certificate_status: string
  reg_id: string | null
  updated_date: string
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

export const centerAPI = {
  createProfile: async (data: CenterCreate): Promise<CenterProfile> => {
    const response = await apiClient.post<CenterProfile>('/center/profile', data)
    return response.data
  },
  getProfile: async (): Promise<CenterProfile> => {
    const response = await apiClient.get<CenterProfile>('/center/profile')
    return response.data
  },
  updateProfile: async (data: Partial<CenterCreate>): Promise<CenterProfile> => {
    const response = await apiClient.put<CenterProfile>('/center/profile', data)
    return response.data
  },
  getSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/center/sessions')
    return response.data
  },
  getApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>('/center/applications')
    return response.data
  },
  getNews: async (): Promise<NewsItem[]> => {
    const response = await apiClient.get<NewsItem[]>('/center/news')
    return response.data
  },
  createSession: async (data: SessionCreate): Promise<Session> => {
    const response = await apiClient.post<Session>('/center/sessions', data)
    return response.data
  },
  updateSession: async (sessionId: number, data: Partial<SessionCreate>): Promise<Session> => {
    const response = await apiClient.put<Session>(`/center/sessions/${sessionId}`, data)
    return response.data
  },
  deleteSession: async (sessionId: number): Promise<void> => {
    await apiClient.delete(`/center/sessions/${sessionId}`)
  },
}

