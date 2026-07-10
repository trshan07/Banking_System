import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { supportService } from '../../services/supportService'

const getSenderName = (sender) => (
  [sender?.firstName, sender?.lastName].filter(Boolean).join(' ') || sender?.email || 'Smart Bank User'
)

const ChatWindow = ({ ticket, onMessage }) => {
  const { user } = useAuth()
  const { socket, online } = useSocket()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const messages = useMemo(() => ticket?.messages || [], [ticket?.messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    if (!socket || !ticket?._id) return undefined

    socket.emit('support:join', { ticketId: ticket._id }, (response) => {
      if (response && !response.success) {
        console.warn('Unable to join support room:', response.message)
      }
    })

    const handleSocketMessage = ({ ticketId, message: incomingMessage }) => {
      if (ticketId === ticket._id && incomingMessage) {
        onMessage?.(incomingMessage)
      }
    }

    socket.on('support:message', handleSocketMessage)
    return () => socket.off('support:message', handleSocketMessage)
  }, [socket, ticket?._id, onMessage])

  const sendViaRest = async (text) => {
    const response = await supportService.addMessage(ticket._id, text)
    const updatedTicket = response.data?.data
    const nextMessage = updatedTicket?.messages?.[updatedTicket.messages.length - 1]
    if (nextMessage) {
      onMessage?.(nextMessage)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanMessage = message.trim()
    if (!cleanMessage || !ticket?._id) return

    setSending(true)
    setMessage('')

    try {
      if (socket && online) {
        socket.emit('support:message', { ticketId: ticket._id, message: cleanMessage }, async (response) => {
          if (!response?.success) {
            await sendViaRest(cleanMessage)
          }
        })
      } else {
        await sendViaRest(cleanMessage)
      }
    } catch (error) {
      setMessage(cleanMessage)
      toast.error(error.response?.data?.message || error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Conversation</h2>
            <p className="text-sm text-gray-500">{online ? 'Live chat connected' : 'Messages are saved through the API'}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="h-96 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No messages yet.
          </div>
        ) : (
          messages.map((item) => {
            const senderId = item.sender?._id || item.sender
            const isMine = String(senderId) === String(user?._id || user?.id)
            return (
              <div key={item._id || item.createdAt} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] rounded-lg px-4 py-3 ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <div className="mb-1 text-xs font-semibold opacity-80">
                    {isMine ? 'You' : getSenderName(item.sender)}
                    {item.isStaff ? ' · Staff' : ''}
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{item.message}</p>
                  <p className="mt-2 text-right text-[11px] opacity-70">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-4">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={sending || ['resolved', 'closed'].includes(ticket?.status)}
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
          placeholder={['resolved', 'closed'].includes(ticket?.status) ? `Ticket is ${ticket.status}` : 'Type your message...'}
        />
        <button
          type="submit"
          disabled={sending || !message.trim() || ['resolved', 'closed'].includes(ticket?.status)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatWindow
