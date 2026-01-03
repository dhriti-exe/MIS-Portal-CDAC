

interface StatusPillProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Submitted: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Selected: { bg: 'bg-green-100', text: 'text-green-800' },
  Rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  Paid: { bg: 'bg-green-100', text: 'text-green-800' },
  Unpaid: { bg: 'bg-red-100', text: 'text-red-800' },
  Issued: { bg: 'bg-green-100', text: 'text-green-800' },
  'Not Issued': { bg: 'bg-gray-100', text: 'text-gray-800' },
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-800' },
  ongoing: { bg: 'bg-purple-100', text: 'text-purple-800' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-800' },
  Active: { bg: 'bg-green-100', text: 'text-green-800' },
  Inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

export default function StatusPill({ status, variant, size = 'sm' }: StatusPillProps) {
  const colors = variant
    ? {
        default: { bg: 'bg-gray-100', text: 'text-gray-800' },
        success: { bg: 'bg-green-100', text: 'text-green-800' },
        warning: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        danger: { bg: 'bg-red-100', text: 'text-red-800' },
        info: { bg: 'bg-blue-100', text: 'text-blue-800' },
      }[variant]
    : statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses}`}
    >
      {status}
    </span>
  )
}

