import React from 'react'

interface TeamMember {
  id: string
  name: string
  initials: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  role?: string
}

interface TeamCardProps {
  members: TeamMember[]
  title?: string
  className?: string
}

const TeamCard: React.FC<TeamCardProps> = ({ members, title = "Team", className = '' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getRandomColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 text-lg font-medium">{title}</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getRandomColor(index)}`}>
                    {member.initials}
                  </div>
                )}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(member.status)}`}></div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-slate-800">{member.initials}</div>
                {member.role && (
                  <div className="text-xs text-slate-500">{member.role}</div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-slate-600">vs</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex space-x-2">
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          LC
        </button>
        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          E1
        </button>
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          Y1
        </button>
        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          MA
        </button>
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          BA
        </button>
      </div>
    </div>
  )
}

export default TeamCard
