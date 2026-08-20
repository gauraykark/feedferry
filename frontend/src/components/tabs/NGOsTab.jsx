import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MessageCircle, MapPin, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function NGOsTab({ onStartChat }) {
  const { profile } = useAuth()
  const [ngos, setNGOs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'ngo').then(({ data }) => {
      setNGOs(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered NGOs</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No NGOs registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ngos.map(ngo => (
            <div key={ngo.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-800">{ngo.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {ngo.city}{ngo.district ? `, ${ngo.district}` : ''}{ngo.state ? `, ${ngo.state}` : ''}
                  {ngo.city === profile?.city && (
                    <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Near You</span>
                  )}
                </p>
              </div>
              {ngo.id !== profile?.id && (
                <button onClick={() => onStartChat(ngo.id, ngo.name)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  <MessageCircle size={16} /> Chat
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
