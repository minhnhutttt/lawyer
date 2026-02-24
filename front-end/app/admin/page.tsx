'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiUsers, FiUserCheck, FiHelpCircle, FiMessageSquare } from 'react-icons/fi'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { getStats, getChartData } from '@/lib/services/admin'
import { Button } from '@/components/ui/button'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Stats = {
  totalUsers: number;
  totalLawyers: number;
  totalQuestions: number;
  totalMessages: number;
};

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('users')
  const [isLoading, setIsLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartError, setChartError] = useState('')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLawyers: 0,
    totalQuestions: 0,
    totalMessages: 0,
  })
  const [chartLabels, setChartLabels] = useState<string[]>([])
  const [chartData, setChartData] = useState<number[][]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await getStats()
        setStats({
          totalUsers: data.total_users,
          totalLawyers: data.total_lawyers,
          totalQuestions: data.total_questions,
          totalMessages: data.total_chats,
        })
        setError('')
      } catch (err) {
        console.error('Failed to fetch admin stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch admin stats')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchChartData = async () => {
      try {
        setChartLoading(true)
        const data = await getChartData()
        setChartLabels(data.labels)
        setChartData(data.data)
        setChartError('')
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
        setChartError(err instanceof Error ? err.message : 'Failed to fetch chart data')
      } finally {
        setChartLoading(false)
      }
    }

    fetchStats()
    fetchChartData()
  }, [])

  // Generate chart data from API response
  const usersChartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [
      {
        label: t('adminDashboard.stats.users'),
        data: chartData[0] || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const lawyersChartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [
      {
        label: t('adminDashboard.stats.lawyers'),
        data: chartData[1] || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const questionsChartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [
      {
        label: t('adminDashboard.stats.questions'),
        data: chartData[2] || [],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const messagesChartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [
      {
        label: t('adminDashboard.stats.messages'),
        data: chartData[3] || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 3,
        },
      },
    },
  }

  const statCards = [
    {
      title: t('adminDashboard.totalUsers'),
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-blue-500',
    },
    {
      title: t('adminDashboard.totalLawyers'),
      value: stats.totalLawyers,
      icon: FiUserCheck,
      color: 'bg-green-500',
    },
    {
      title: t('adminDashboard.totalQuestions'),
      value: stats.totalQuestions,
      icon: FiHelpCircle,
      color: 'bg-yellow-500',
    },
    {
      title: t('adminDashboard.totalMessages'),
      value: stats.totalMessages,
      icon: FiMessageSquare,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
        {t('adminDashboard.title')}
      </h1>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {isLoading ? (
          // Loading skeleton
          Array(4).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200 animate-pulse"
            >
              <div className="flex items-center">
                <div className="bg-gray-200 p-3 rounded-lg h-12 w-12"></div>
                <div className="ml-4 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg self-center sm:self-auto mb-2 sm:mb-0`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="sm:ml-4 text-center sm:text-left">
                    <h2 className="text-xs sm:text-sm font-medium text-gray-500">
                      {stat.title}
                    </h2>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
            {['users', 'lawyers', 'questions', 'messages'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant="ghost"
                className={`py-3 px-3 sm:py-4 sm:px-6 text-sm font-medium rounded-none flex-shrink-0 ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t(`adminDashboard.${tab}`)}
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-3 sm:p-6">
          {chartLoading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : chartError ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
              {chartError}
            </div>
          ) : (
            <div className="h-48 sm:h-64">
              {activeTab === 'users' && <Line data={usersChartData} options={chartOptions} />}
              {activeTab === 'lawyers' && <Line data={lawyersChartData} options={chartOptions} />}
              {activeTab === 'questions' && <Line data={questionsChartData} options={chartOptions} />}
              {activeTab === 'messages' && <Line data={messagesChartData} options={chartOptions} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}