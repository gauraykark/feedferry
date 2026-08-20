import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import PostFoodModal from '../PostFoodModal'
import { Plus, MapPin, Calendar, Clock } from 'lucide-react'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  collected: 'bg-purple-100 text-purple-700',
  'in-transit': 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
}

export default function DonationsTab() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false })
    setDonations(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [user.id])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Donations</h2>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Plus size={18} /> Post New Donation
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg">No donations yet. Post your first one!</p>
          <button onClick={() => setShowModal(true)}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
            Post Food
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {d.food_name} — {d.quantity} {d.unit}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {d.pickup_city}, {d.pickup_state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {new Date(d.created_at).toLocaleDateString()}
                    </span>
                    {d.expiry_at && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Expires: {new Date(d.expiry_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {d.description && <p className="text-sm text-gray-500 mt-2">{d.description}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${STATUS_COLORS[d.status] || 'bg-gray-100 text-gray-600'}`}>
                  {d.status}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{d.food_category}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{d.veg_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <PostFoodModal onClose={() => setShowModal(false)} onSuccess={load} />}
    </div>
  )
}
