import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { MessageCircle, MapPin } from 'lucide-react'

export default function DonorsTab({ onStartChat }) {
  const { user, profile } = useAuth()
  const [donors, setDonors] = useState([])
  const [donorStats, setDonorStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: donations }] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'donor'),
        supabase.from('donations').select('donor_id, food_name, quantity, unit, status').eq('status', 'pending'),
      ])
      setDonors((profiles || []).filter(p => p.id !== user.id))
      const stats = {}
      ;(donations || []).forEach(d => {
        if (!stats[d.donor_id]) stats[d.donor_id] = []
        stats[d.donor_id].push(d)
      })
      setDonorStats(stats)
      setLoading(false)
    }
    load()
  }, [user.id])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Donors</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : donors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No donors available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donors.map(donor => {
            const items = donorStats[donor.id] || []
            return (
              <div key={donor.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{donor.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {donor.city}{donor.district ? `, ${donor.district}` : ''}{donor.state ? `, ${donor.state}` : ''}
                      {donor.city === profile?.city && (
                        <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Near You</span>
                      )}
                    </p>
                    {items.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {items.map((item, i) => (
                          <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {item.food_name}: {item.quantity} {item.unit}
                          </span>
                        ))}
                      </div>
                    )}
                    {items.length === 0 && <p className="text-xs text-gray-400 mt-1">No active donations</p>}
                  </div>
                  <button onClick={() => onStartChat(donor.id, donor.name)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <MessageCircle size={16} /> Chat
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
