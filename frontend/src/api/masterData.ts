
import apiClient from './client'

export interface State {
  state_id: number
  state_name: string
  state_code: string
}

export interface District {
  district_id: number
  district_name: string
  district_code: string
  state_id: number
}

export interface College {
  college_id: number
  college_name: string
  state_id: number
}

export interface Caste {
  caste_id: number
  caste_name: string
}

export interface Qualification {
  qualification_id: number
  qualification_name: string
  qual_code: number | null
}

export interface Stream {
  stream_id: number
  stream_name: string
  qual_code: number | null
}

export const masterDataAPI = {
  getStates: async (): Promise<State[]> => {
    const response = await apiClient.get<State[]>('/master/states')
    return response.data
  },
  getDistricts: async (stateId: number): Promise<District[]> => {
    const response = await apiClient.get<District[]>(`/master/districts?state_id=${stateId}`)
    return response.data
  },
  getColleges: async (stateId: number): Promise<College[]> => {
    const response = await apiClient.get<College[]>(`/master/colleges?state_id=${stateId}`)
    return response.data
  },
  getCastes: async (): Promise<Caste[]> => {
    const response = await apiClient.get<Caste[]>('/master/castes')
    return response.data
  },
  getQualifications: async (): Promise<Qualification[]> => {
    const response = await apiClient.get<Qualification[]>('/master/qualifications')
    return response.data
  },
  getStreams: async (): Promise<Stream[]> => {
    const response = await apiClient.get<Stream[]>('/master/streams')
    return response.data
  },
}