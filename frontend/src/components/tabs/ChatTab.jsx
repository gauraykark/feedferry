import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Send, MessageCircle } from 'lucide-react'

export default function ChatTab({ initialUserId, initialUserName }) {
  const { user, profile } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(
    initialUserId ? { userId: initialUserId, userName: initialUserName } : null
  )
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [user.id])

  // If we were navigated here with a specific user to chat with (e.g. from the
  // NGOs/Donors "Chat" button), open that conversation.
  useEffect(() => {
    if (initialUserId) {
      setActiveConv({ userId: initialUserId, userName: initialUserName })
    }
  }, [initialUserId, initialUserName])

  useEffect(() => {
    if (!activeConv) return
    loadMessages(activeConv.userId)

    // Real-time subscription
    const channel = supabase.channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const msg = payload.new
        const convKey = getConvKey(activeConv.userId)
        if (msg.conversation_key === convKey) {
          setMessages(prev => [...prev, msg])
          scrollToBottom()
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activeConv?.userId])

  useEffect(() => { scrollToBottom() }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function getConvKey(otherId) {
    return [user.id, otherId].sort().join('_')
  }

  async function loadConversations() {
    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, message, created_at, conversation_key')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!data) return

    const seen = new Set()
    const convs = []
    for (const msg of data) {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
      if (seen.has(otherId)) continue
      seen.add(otherId)

      const { data: otherProfile } = await supabase.from('profiles').select('name, role').eq('id', otherId).single()
      convs.push({ userId: otherId, userName: otherProfile?.name || 'Unknown', role: otherProfile?.role, lastMessage: msg.message })
    }
    setConversations(convs)
  }

  async function loadMessages(otherId) {
    const convKey = getConvKey(otherId)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_key', convKey)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (!input.trim() || !activeConv) return
    const convKey = getConvKey(activeConv.userId)
    const { error } = await supabase.from('messages').insert({
      conversation_key: convKey,
      sender_id: user.id,
      sender_name: profile.name,
      receiver_id: activeConv.userId,
      message: input.trim(),
    })
    if (!error) {
      setInput('')
      loadConversations()
    }
  }

  function startChat(userId, userName, role) {
    setActiveConv({ userId, userName, role })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '70vh' }}>
        <div className="grid grid-cols-[260px_1fr] h-full divide-x divide-gray-100">
          {/* Conversations list */}
          <div className="flex flex-col">
            <div className="bg-green-600 text-white px-4 py-3 font-semibold text-sm">
              Conversations
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm mt-8">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  No conversations yet. Visit NGOs or Donors tab to start chatting!
                </div>
              ) : (
                conversations.map(conv => (
                  <button key={conv.userId}
                    onClick={() => startChat(conv.userId, conv.userName, conv.role)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors
                      ${activeConv?.userId === conv.userId ? 'bg-green-50 border-l-4 border-l-green-600' : 'hover:bg-gray-50'}`}>
                    <div className="font-semibold text-gray-800 text-sm">{conv.userName}</div>
                    <div className="text-xs text-gray-400 capitalize">{conv.role}</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-col h-full">
            <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-700 text-sm border-b border-gray-100">
              {activeConv ? `💬 Chat with ${activeConv.userName}` : 'Select a conversation'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!activeConv ? (
                <div className="text-center mt-12 text-gray-400">
                  <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                  Select a conversation to view messages
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center mt-12 text-gray-400 text-sm">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender_id === user.id
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-green-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {activeConv && (
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={sendMessage} disabled={!input.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl transition-colors">
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
