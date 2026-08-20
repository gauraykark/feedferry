import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LOCATION_DATA, uniqSorted } from '../lib/locationData'
import { supabase } from '../lib/supabase'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PostFoodModal({ onClose, onSuccess }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    foodName: '', foodCategory: '', vegType: '', quantity: '', unit: 'kg',
    expiryAt: '', pickupState: '', pickupDistrict: '', pickupCity: '', pickupAddressLine: '', description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const states = uniqSorted(Object.keys(LOCATION_DATA))
  const districts = form.pickupState ? uniqSorted(Object.keys(LOCATION_DATA[form.pickupState] || {})) : []
  const cities = form.pickupState && form.pickupDistrict ? uniqSorted(LOCATION_DATA[form.pickupState]?.[form.pickupDistrict] || []) : []

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = []
    if (!form.foodName.trim()) errors.push('Food name required.')
    if (!form.foodCategory) errors.push('Food category required.')
    if (!form.vegType) errors.push('Veg/non-veg required.')
    if (!(parseFloat(form.quantity) > 0)) errors.push('Quantity must be > 0.')
    if (!form.expiryAt) {
      errors.push('Expiry required.')
    } else {
      const expiry = new Date(form.expiryAt)
      const minValid = new Date(Date.now() + 30 * 60 * 1000)
      if (expiry <= new Date()) errors.push('Expiry must be in the future.')
      else if (expiry < minValid) errors.push('Expiry should be at least 30 minutes from now.')
    }
    if (!form.pickupState || !form.pickupDistrict || !form.pickupCity) errors.push('State, district and city required.')
    if (!form.pickupAddressLine.trim()) errors.push('Full pickup address required.')
    if (errors.length) { setError(errors.join(' ')); return }

    setLoading(true)
    try {
      const { error: dbError } = await supabase.from('donations').insert({
        donor_id: user.id,
        donor_name: profile.name,
        donor_location: profile.city,
        food_name: form.foodName.trim(),
        food_category: form.foodCategory,
        veg_type: form.vegType,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        expiry_at: new Date(form.expiryAt).toISOString(),
        pickup_state: form.pickupState,
        pickup_district: form.pickupDistrict,
        pickup_city: form.pickupCity,
        pickup_address_line: form.pickupAddressLine.trim(),
        description: form.description.trim(),
        status: 'pending',
      })
      if (dbError) throw dbError
      toast.success('Food donation posted! 🎉')
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to post donation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Post Food Donation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Food name (e.g. Veg Biryani, Bread Loaves)" required value={form.foodName} onChange={e => set('foodName', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Food Type</label>
              <select required value={form.foodCategory} onChange={e => set('foodCategory', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                <option value="">Select Category</option>
                <option value="cooked">Cooked Food</option>
                <option value="raw">Raw Ingredients</option>
                <option value="bakery">Bakery Items</option>
                <option value="fruits">Fruits & Vegetables</option>
                <option value="dairy">Dairy Products</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Veg / Non-veg</label>
              <select required value={form.vegType} onChange={e => set('vegType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                <option value="">Select</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-veg</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <input type="number" placeholder="Quantity" min="1" required value={form.quantity} onChange={e => set('quantity', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <select value={form.unit} onChange={e => set('unit', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
              <option value="kg">kg</option>
              <option value="servings">Servings</option>
              <option value="packages">Packages</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Expiry date & time</label>
            <input type="datetime-local" required value={form.expiryAt} onChange={e => set('expiryAt', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Pickup address</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select required value={form.pickupState} onChange={e => { set('pickupState', e.target.value); set('pickupDistrict', ''); set('pickupCity', '') }}
                className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                <option value="">State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select required value={form.pickupDistrict} onChange={e => { set('pickupDistrict', e.target.value); set('pickupCity', '') }}
                disabled={!form.pickupState}
                className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
                <option value="">District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select required value={form.pickupCity} onChange={e => set('pickupCity', e.target.value)}
                disabled={!form.pickupDistrict}
                className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
                <option value="">City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea placeholder="Full address / landmark" rows={2} required value={form.pickupAddressLine} onChange={e => set('pickupAddressLine', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          <textarea placeholder="Extra details (spice level, packing, handling notes...)" rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors">
            {loading ? 'Posting...' : 'Post Donation'}
          </button>
        </form>
      </div>
    </div>
  )
}
