import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Gift, List, Building2, User, MessageCircle, BarChart3, MapPin } from 'lucide-react'
import Overview from './tabs/Overview'
import DonationsTab from './tabs/DonationsTab'
import ListingsTab from './tabs/ListingsTab'
import NGOsTab from './tabs/NGOsTab'
import DonorsTab from './tabs/DonorsTab'
import ChatTab from './tabs/ChatTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import TrackingTab from './tabs/TrackingTab'

const ALL_TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard, roles: ['donor', 'ngo', 'volunteer'] },
  { id: 'donations', label: 'Post Food', Icon: Gift, roles: ['donor'] },
  { id: 'listings', label: 'Available Food', Icon: List, roles: ['ngo'] },
  { id: 'ngos', label: 'NGOs', Icon: Building2, roles: ['donor', 'ngo', 'volunteer'] },
  { id: 'donors', label: 'Donors', Icon: User, roles: ['donor', 'ngo', 'volunteer'] },
  { id: 'chat', label: 'Messages', Icon: MessageCircle, roles: ['donor', 'ngo', 'volunteer'] },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3, roles: ['donor', 'ngo', 'volunteer'] },
  { id: 'tracking', label: 'Track Donations', Icon: MapPin, roles: ['donor', 'ngo', 'volunteer'] },
]

export default function Dashboard({ activeTab, setActiveTab }) {
  const { profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Tracks who the user clicked "Chat" on from the NGOs/Donors tabs, so the
  // Messages tab can open that conversation directly instead of landing empty.
  const [chatTarget, setChatTarget] = useState(null)

  const visibleTabs = ALL_TABS.filter(t => t.roles.includes(profile?.role))

  function startChat(id, name) {
    setChatTarget({ id, name })
    setActiveTab('chat')
  }

  function renderTab() {
    switch (activeTab) {
      case 'overview': return <Overview onTabChange={setActiveTab} />
      case 'donations': return <DonationsTab />
      case 'listings': return <ListingsTab />
      case 'ngos': return <NGOsTab onStartChat={startChat} />
      case 'donors': return <DonorsTab onStartChat={startChat} />
      case 'chat': return <ChatTab initialUserId={chatTarget?.id} initialUserName={chatTarget?.name} />
      case 'analytics': return <AnalyticsTab />
      case 'tracking': return <TrackingTab />
      default: return <Overview onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen pt-16 bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed md:static top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col gap-1 py-4 px-3 transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {visibleTabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left
              ${activeTab === id ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile sidebar toggle */}
          <button className="md:hidden mb-4 flex items-center gap-2 text-sm text-gray-600 font-medium bg-white border border-gray-200 px-4 py-2 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            <LayoutDashboard size={16} /> Menu
          </button>
          {renderTab()}
        </div>
      </main>
    </div>
  )
}
