import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { getCityCoordinates } from '../../lib/locationData'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Clock, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const STATUS_MAP = {
  pending:    { label: 'Posted',    color: '#f39c12', steps: 0 },
  accepted:   { label: 'Accepted',  color: '#3498db', steps: 1 },
  collected:  { label: 'Picked Up', color: '#9b59b6', steps: 2 },
  'in-transit':{ label: 'In Transit', color: '#e67e22', steps: 3 },
  delivered:  { label: 'Delivered', color: '#2ecc71', steps: 4 },
  completed:  { label: 'Delivered', color: '#2ecc71', steps: 4 },
}

const STEPS = ['Posted', 'Accepted', 'Collected', 'In Transit', 'Delivered']

function createColoredIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function TrackingCard({ donation, profile, allProfiles }) {
  const [expanded, setExpanded] = useState(false)
  const statusInfo = STATUS_MAP[donation.status] || STATUS_MAP.pending
  const ngo = donation.accepted_by ? allProfiles.find(p => p.id === donation.accepted_by) : null
  const donor = allProfiles.find(p => p.id === donation.donor_id)

  const donorCity = donation.pickup_city || donation.donor_location || ''
  const ngoCity = ngo?.city || ''

  const donorCoords = getCityCoordinates(donorCity)
  const ngoCoords = ngoCity ? getCityCoordinates(ngoCity) : null
  const showMap = ngo && ngoCoords && donation.status !== 'pending'
  const center = showMap
    ? [(donorCoords[0] + ngoCoords[0]) / 2, (donorCoords[1] + ngoCoords[1]) / 2]
    : donorCoords

  async function updateStatus(newStatus) {
    const { error } = await supabase.from('donations').update({
      status: newStatus,
      ...(newStatus === 'collected' ? { collected_at: new Date().toISOString() } : {}),
      ...(newStatus === 'in-transit' ? { in_transit_at: new Date().toISOString() } : {}),
      ...(newStatus === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
    }).eq('id', donation.id)
    if (error) toast.error('Failed to update')
    else toast.success('Status updated!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">
              {donation.food_name} — {donation.quantity} {donation.unit}
            </h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {donorCity}{donation.pickup_state ? `, ${donation.pickup_state}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(donation.created_at).toLocaleDateString()}
              </span>
              {donation.expiry_at && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> Expires: {new Date(donation.expiry_at).toLocaleString()}
                </span>
              )}
            </div>
            {ngo && (
              <p className="text-sm mt-2 text-gray-500">
                {profile?.role === 'donor' ? `Accepted by: ` : `Donated by: `}
                <span className="font-semibold text-gray-700">
                  {profile?.role === 'donor' ? ngo.name : donor?.name}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-semibold capitalize whitespace-nowrap"
              style={{ background: `${statusInfo.color}20`, color: statusInfo.color, border: `2px solid ${statusInfo.color}` }}>
              {statusInfo.label}
            </span>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 p-1">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${i <= statusInfo.steps ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                  style={i <= statusInfo.steps ? { background: statusInfo.color } : {}}>
                  {i < statusInfo.steps ? '✓' : i + 1}
                </div>
                <span className="text-xs text-gray-500 mt-1 hidden sm:block whitespace-nowrap">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 transition-colors"
                  style={{ background: i < statusInfo.steps ? statusInfo.color : '#e5e7eb' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded section: map + actions */}
      {expanded && (
        <div className="border-t border-gray-100">
          {showMap && (
            <div style={{ height: 280 }}>
              <MapContainer center={center} zoom={showMap ? 10 : 12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                <Marker position={donorCoords} icon={createColoredIcon('#2ecc71', '🏠')}>
                  <Popup><strong>Donor</strong><br />{donorCity}</Popup>
                </Marker>
                {ngoCoords && (
                  <>
                    <Marker position={ngoCoords} icon={createColoredIcon('#3498db', '🏢')}>
                      <Popup><strong>NGO</strong><br />{ngoCity}</Popup>
                    </Marker>
                    <Polyline positions={[donorCoords, ngoCoords]}
                      color={statusInfo.color} weight={4} dashArray={donation.status === 'in-transit' ? '10 10' : undefined} />
                  </>
                )}
              </MapContainer>
            </div>
          )}

          {/* Actions for NGO */}
          {profile?.role === 'ngo' && donation.status === 'accepted' && (
            <div className="p-4 flex gap-3">
              <button onClick={() => updateStatus('collected')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                📦 Mark as Collected
              </button>
              <button onClick={() => updateStatus('in-transit')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                🚚 Mark as In Transit
              </button>
            </div>
          )}
          {profile?.role === 'ngo' && donation.status === 'in-transit' && (
            <div className="p-4">
              <button onClick={() => updateStatus('delivered')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                ✅ Mark as Delivered
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TrackingTab() {
  const { user, profile } = useAuth()
  const [donations, setDonations] = useState([])
  const [allProfiles, setAllProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let query = supabase.from('donations').select('*')
      if (profile?.role === 'donor') query = query.eq('donor_id', user.id)
      else if (profile?.role === 'ngo') query = query.eq('accepted_by', user.id)
      else if (profile?.role === 'volunteer') query = query.eq('assigned_to', user.id)
      query = query.order('created_at', { ascending: false })

      const [{ data: dons }, { data: profiles }] = await Promise.all([
        query,
        supabase.from('profiles').select('*'),
      ])
      setDonations(dons || [])
      setAllProfiles(profiles || [])
      setLoading(false)
    }
    load()

    // Real-time updates
    const channel = supabase.channel('tracking')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'donations' }, () => load())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user.id, profile?.role])

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Donations</h2>
      <p className="text-gray-500 mb-6">Monitor the status and location of food donations in real-time.</p>

      {donations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">
            {profile?.role === 'donor' ? 'Post a donation to start tracking!' : 'Accepted donations will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map(d => (
            <TrackingCard key={d.id} donation={d} profile={profile} allProfiles={allProfiles} />
          ))}
        </div>
      )}
    </div>
  )
}
