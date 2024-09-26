'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useParams } from 'next/navigation'
import { useSession } from "next-auth/react"
import { Send } from 'lucide-react'

// Create the ChatContext here (scoped to this component)
const ChatContext = createContext()

export default function MainPanel() {
  const { data: session } = useSession()
  const username = session?.user?.name || "Anonymous"
  
  const [api] = useState("https://backendchat-production-d8bf.up.railway.app")
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [userId, setUserId] = useState("")
  const [roomId, setRoomId] = useState("")
  const id = useParams()

  useEffect(() => {
    const newSocket = io(api)
    setSocket(newSocket)

    newSocket.on("connect", async () => {
      setUserId(newSocket.id)
      
      if (id) {
        const newRoomId = id.id
        setRoomId(newRoomId)
        console.log("RoomId:", newRoomId)

        await joinRoom(newRoomId, newSocket.id, username)
      }
    })

    newSocket.on("message", addMessage)

    return () => {
      if (newSocket) {
        newSocket.off("message", addMessage)
        newSocket.disconnect()
      }
    }
  }, [api, id, username])

  const joinRoom = async (roomId, socketId, username) => {
    try {
      const response = await fetch(`${api}/joinRoom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, socketId, username }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log(data.message)
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error("Error joining room:", error)
    }
  }

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const sendMessage = () => {
    if (newMessage.trim() !== "" && socket) {
      const message = { 
        senderId: userId, 
        senderName: username,
        content: newMessage, 
        room: roomId 
      }
      socket.emit('message', message)
      setNewMessage("")
    }
  }

  return (
    <ChatContext.Provider value={{ api, messages, setMessages }}>
<div className="flex flex-col h-full md:h-screen w-full md:w-80 bg-gray-800 text-white">
  <div className="flex-1 flex flex-col max-h-[calc(100vh-8rem)]">
    <div className="p-2 bg-gray-700 rounded-t-lg">
      <h2 className="text-lg font-semibold truncate">{username}</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id || msg.content + Math.random()}
          className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-2 ${
              msg.senderId === userId ? 'bg-blue-600' : 'bg-gray-600'
            } shadow-md`}
          >
            <p className="text-xs font-semibold">
              {msg.senderId === userId ? "You" : msg.senderName}
            </p>
            <p className="text-sm break-words">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div className="p-2 bg-gray-700 rounded-b-lg flex-shrink-0">
    <div className="flex space-x-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 bg-gray-600 text-white text-sm rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 transition duration-200 flex items-center justify-center"
      >
        <Send size={16} />
      </button>
    </div>
  </div>
</div>



    </ChatContext.Provider>
  )
}