import { motion } from 'framer-motion'
import { FileCheck, Download, Award, Mail, Plus } from 'lucide-react'

interface QuickActionsCardProps {
  hasCertificate: boolean
}

export default function QuickActionsCard({ hasCertificate }: QuickActionsCardProps) {
  const actions = [
    {
      id: 'apply',
      label: 'Apply to Session',
      icon: Plus,
      onClick: () => {
        console.log('Apply to session')
      },
      variant: 'primary' as const,
    },
    {
      id: 'receipt',
      label: 'Download Receipt',
      icon: Download,
      onClick: () => {
        console.log('Download receipt')
      },
      variant: 'default' as const,
    },
    {
      id: 'certificate',
      label: 'Download Certificate',
      icon: Award,
      onClick: () => {
        console.log('Download certificate')
      },
      variant: 'default' as const,
      disabled: !hasCertificate,
    },
    {
      id: 'contact',
      label: 'Contact Centre',
      icon: Mail,
      onClick: () => {
        window.location.href = 'mailto:support@cdac.in'
      },
      variant: 'default' as const,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileCheck className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          const isPrimary = action.variant === 'primary'

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                isPrimary
                  ? 'border-primary-200 bg-primary-50 hover:border-primary-300 hover:bg-primary-100'
                  : action.disabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isPrimary
                    ? 'bg-primary-600 text-white'
                    : action.disabled
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`font-medium ${
                  isPrimary
                    ? 'text-primary-900'
                    : action.disabled
                    ? 'text-gray-400'
                    : 'text-gray-900'
                }`}
              >
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

