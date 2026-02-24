import { AxiosError } from 'axios'
import { get } from '../api'
import { ApiResponse } from '../types/api'

export interface Stats {
  total_users: number
  total_lawyers: number
  total_questions: number
  total_chats: number
}

export interface ChartData {
  labels: string[]
  data: number[][]
}

export async function getStats(): Promise<Stats> {
  try {
    const response = await get<Stats>('/admin/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats')
    }
    throw error
  }
}

export async function getChartData(): Promise<ChartData> {
  try {
    const response = await get<ChartData>('/admin/chart')
    return response.data
  } catch (error) {
    console.error('Error fetching chart data:', error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chart data')
    }
    throw error
  }
}