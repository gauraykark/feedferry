import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import { LoginModal, RegisterModal } from './components/AuthModals'

function AppInner() {
  const { profile, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading Feed Ferry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        currentView={activeTab}
        onTabChange={setActiveTab}
      />

      {profile ? (
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <LandingPage onGetStarted={() => setShowLogin(true)} />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
