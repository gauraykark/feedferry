import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Leaf, Users, Package, Wind } from 'lucide-react'

export default function AnalyticsTab() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ myDonations: 0, totalQty: 0, wastePrevented: 0, co2Saved: 0 })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('donations').select('quantity').eq('donor_id', user.id)
      const items = data || []
      const totalQty = items.reduce((s, d) => s + (parseFloat(d.quantity) || 0), 0)
      setStats({
        myDonations: items.length,
        totalQty,
        wastePrevented: totalQty.toFixed(1),
        co2Saved: (totalQty * 2.5).toFixed(1),
      })
    }
    load()
  }, [user.id])

  const cards = [
    { Icon: Package, label: 'Your Donations', value: stats.myDonations, color: 'bg-green-100 text-green-600', suffix: '' },
    { Icon: Users, label: 'People Helped (est.)', value: Math.round(stats.totalQty * 2), color: 'bg-blue-100 text-blue-600', suffix: '' },
    { Icon: Leaf, label: 'Waste Prevented', value: stats.wastePrevented, color: 'bg-yellow-100 text-yellow-600', suffix: ' kg' },
    { Icon: Wind, label: 'CO₂ Saved', value: stats.co2Saved, color: 'bg-purple-100 text-purple-600', suffix: ' kg' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Impact</h2>
      <p className="text-gray-500 mb-8">Your personal impact on fighting food waste and hunger.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ Icon, label, value, color, suffix }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${color}`}>
              <Icon size={24} />
            </div>
            <h4 className="text-3xl font-bold text-gray-800">{value}{suffix}</h4>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">How Your Impact Is Calculated</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
            <p><strong>People helped:</strong> Estimated at 2 people per kg of food donated.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
            <p><strong>Waste prevented:</strong> Total kg of food rescued from going to landfill.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
            <p><strong>CO₂ saved:</strong> Food waste generates ~2.5 kg CO₂ per kg. Each donation prevents that.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
