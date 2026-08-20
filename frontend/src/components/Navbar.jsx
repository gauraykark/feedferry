import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Leaf, Menu, X } from 'lucide-react'

export default function Navbar({ onLoginClick, onRegisterClick, currentView, onTabChange }) {
  const { profile, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const publicLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const dashboardLinks = [
    { label: 'Overview', tab: 'overview' },
    ...(profile?.role === 'donor' ? [{ label: 'Post Food', tab: 'donations' }] : []),
    ...(profile?.role === 'ngo' ? [{ label: 'Available Food', tab: 'listings' }] : []),
    { label: 'NGOs', tab: 'ngos' },
    { label: 'Donors', tab: 'donors' },
    { label: 'Messages', tab: 'chat' },
    { label: 'Track', tab: 'tracking' },
    { label: 'Analytics', tab: 'analytics' },
  ]

  const links = profile ? dashboardLinks : publicLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-green-600 font-bold text-xl cursor-pointer"
            onClick={() => { if (profile) onTabChange('overview') }}>
            <Leaf size={24} />
            <span>Feed Ferry</span>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <li key={link.label}>
                {profile ? (
                  <button
                    onClick={() => onTabChange(link.tab)}
                    className={`text-gray-600 hover:text-green-600 font-medium transition-colors ${currentView === link.tab ? 'text-green-600 border-b-2 border-green-600 pb-0.5' : ''}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <a href={link.href} className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  {profile.name} <span className="text-green-600 capitalize">({profile.role})</span>
                </span>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={onLoginClick} className="text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                  Login
                </button>
                <button onClick={onRegisterClick} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map(link => (
            <div key={link.label}>
              {profile ? (
                <button
                  onClick={() => { onTabChange(link.tab); setMobileOpen(false) }}
                  className="w-full text-left text-gray-700 hover:text-green-600 py-1.5 font-medium"
                >
                  {link.label}
                </button>
              ) : (
                <a href={link.href} onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 hover:text-green-600 py-1.5 font-medium">
                  {link.label}
                </a>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {profile ? (
              <button onClick={() => { logout(); setMobileOpen(false) }}
                className="w-full bg-red-500 text-white py-2 rounded-lg font-medium">
                Logout
              </button>
            ) : (
              <>
                <button onClick={() => { onLoginClick(); setMobileOpen(false) }}
                  className="w-full border border-green-600 text-green-600 py-2 rounded-lg font-medium">
                  Login
                </button>
                <button onClick={() => { onRegisterClick(); setMobileOpen(false) }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
