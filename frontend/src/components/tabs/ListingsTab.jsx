import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LOCATION_DATA, uniqSorted } from '../../lib/locationData'
import { MapPin, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ListingsTab() {
  const { user, profile } = useAuth()
  const [donations, setDonations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ state: '', district: '', city: '' })

  const states = uniqSorted(Object.keys(LOCATION_DATA))
  const districts = filters.state ? uniqSorted(Object.keys(LOCATION_DATA[filters.state] || {})) : []
  const cities = filters.state && filters.district ? uniqSorted(LOCATION_DATA[filters.state]?.[filters.district] || []) : []

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setDonations(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    let list = [...donations]
    if (filters.state) list = list.filter(d => d.pickup_state === filters.state)
    if (filters.district) list = list.filter(d => d.pickup_district === filters.district)
    if (filters.city) list = list.filter(d => d.pickup_city === filters.city)

    // Sort by proximity to NGO's city first
    const myCity = profile?.city || ''
    list.sort((a, b) => {
      const aScore = a.pickup_city === myCity ? 1 : 0
      const bScore = b.pickup_city === myCity ? 1 : 0
      if (aScore !== bScore) return bScore - aScore
      return new Date(b.created_at) - new Date(a.created_at)
    })
    setFiltered(list)
  }, [donations, filters, profile])

  async function accept(id) {
    const { error } = await supabase.from('donations').update({
      status: 'accepted',
      accepted_by: user.id,
      accepted_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) { toast.error('Failed to accept'); return }
    toast.success('Donation accepted! Please collect it.')
    load()
  }

  const setFilter = (field, val) => {
    setFilters(p => {
      const next = { ...p, [field]: val }
      if (field === 'state') { next.district = ''; next.city = '' }
      if (field === 'district') { next.city = '' }
      return next
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Food Donations</h2>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Filter by location:</p>
        <div className="grid grid-cols-3 gap-3">
          <select value={filters.state} onChange={e => setFilter('state', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.district} onChange={e => setFilter('district', e.target.value)}
            disabled={!filters.state}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.city} onChange={e => setFilter('city', e.target.value)}
            disabled={!filters.district}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">No donations found for selected filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {d.food_name} — {d.quantity} {d.unit}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">By: {d.donor_name}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-green-600">
                      <MapPin size={14} />
                      {d.pickup_city}, {d.pickup_district}, {d.pickup_state}
                      {d.pickup_city === profile?.city && (
                        <span className="ml-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Near You</span>
                      )}
                    </span>
                    {d.expiry_at && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Expires: {new Date(d.expiry_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {d.description && <p className="text-sm text-gray-500 mt-2">{d.description}</p>}
                  {d.pickup_address_line && (
                    <p className="text-xs text-gray-400 mt-1">📍 {d.pickup_address_line}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{d.food_category}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{d.veg_type}</span>
                  </div>
                </div>
                <button onClick={() => accept(d.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                  <CheckCircle size={16} /> Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
