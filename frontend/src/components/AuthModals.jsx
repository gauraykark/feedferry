import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LOCATION_DATA, uniqSorted } from '../lib/locationData'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Welcome back!')
      onClose()
    } catch (err) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Feed Ferry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <button type="submit" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => { onClose(); onSwitchToRegister() }} className="text-green-600 font-semibold hover:underline">
          Register here
        </button>
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">Test Accounts:</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>Donor: donor@test.com / 123456</p>
          <p>NGO: ngo@test.com / 123456</p>
          <p>Volunteer: volunteer@test.com / 123456</p>
        </div>
      </div>
    </Modal>
  )
}

export function RegisterModal({ onClose }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', state: '', district: '', city: '' })
  const [loading, setLoading] = useState(false)

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const states = uniqSorted(Object.keys(LOCATION_DATA))
  const districts = form.state ? uniqSorted(Object.keys(LOCATION_DATA[form.state] || {})) : []
  const cities = form.state && form.district ? uniqSorted(LOCATION_DATA[form.state]?.[form.district] || []) : []

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.state || !form.district || !form.city) {
      toast.error('Please select state, district and city')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Registered successfully! Welcome to Feed Ferry 🎉')
      onClose()
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register with Feed Ferry</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Full Name" required value={form.name} onChange={e => set('name', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input type="email" placeholder="Email" required value={form.email} onChange={e => set('email', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={e => set('password', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <select required value={form.role} onChange={e => set('role', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
          <option value="">Select Role</option>
          <option value="donor">Donor (Restaurant / Individual)</option>
          <option value="ngo">NGO (Non-profit)</option>
          <option value="volunteer">Volunteer (Delivery)</option>
        </select>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Your Location</label>
          <select required value={form.state} onChange={e => { set('state', e.target.value); set('district', ''); set('city', '') }}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
            <option value="">Select State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select required value={form.district} onChange={e => { set('district', e.target.value); set('city', '') }}
            disabled={!form.state}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
            <option value="">Select District</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select required value={form.city} onChange={e => set('city', e.target.value)}
            disabled={!form.district}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 disabled:opacity-50">
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Modal>
  )
}
