import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Gift, Building2, Users, Clock } from 'lucide-react'

export default function Overview({ onTabChange }) {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ meals: 0, ngos: 0, users: 0, pending: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: meals }, { data: profiles }, { count: pending }] = await Promise.all([
        supabase.from('donations').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('role'),
        supabase.from('donations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ])
      const ngos = (profiles || []).filter(p => p.role === 'ngo').length
      setStats({ meals: meals || 0, ngos, users: (profiles || []).length, pending: pending || 0 })
    }
    load()
  }, [])

  const cards = [
    { Icon: Gift, label: 'Total Meals Donated', value: stats.meals, color: 'bg-green-100 text-green-600' },
    { Icon: Building2, label: 'Active NGOs', value: stats.ngos, color: 'bg-blue-100 text-blue-600' },
    { Icon: Users, label: 'Community Members', value: stats.users, color: 'bg-purple-100 text-purple-600' },
    { Icon: Clock, label: 'Pending Donations', value: stats.pending, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <p className="text-gray-500 mb-8">Welcome back, <span className="font-semibold text-green-600">{profile?.name}</span>! Here's what's happening.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map(({ Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={24} />
            </div>
            <h4 className="text-3xl font-bold text-gray-800">{value}</h4>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {profile?.role === 'donor' && (
            <button onClick={() => onTabChange('donations')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-medium text-left transition-colors">
              <div className="text-2xl mb-2">🍛</div>
              Post a Food Donation
            </button>
          )}
          {profile?.role === 'ngo' && (
            <button onClick={() => onTabChange('listings')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-medium text-left transition-colors">
              <div className="text-2xl mb-2">📋</div>
              View Available Food
            </button>
          )}
          <button onClick={() => onTabChange('chat')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-medium text-left transition-colors">
            <div className="text-2xl mb-2">💬</div>
            Open Messages
          </button>
          <button onClick={() => onTabChange('tracking')}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl font-medium text-left transition-colors">
            <div className="text-2xl mb-2">📍</div>
            Track Donations
          </button>
        </div>
      </div>
    </div>
  )
}
