import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const username = ref('')
  const room = ref('')
  const messages = ref([])
  const onlineUsers = ref([])
  const privateChats = ref({}) // { username: [messages] }
  const activePrivateChat = ref(null) // currently open DM

  function setUser(name, selectedRoom) {
    username.value = name
    room.value = selectedRoom
    messages.value = []
    onlineUsers.value = []
  }

  function addMessage(msg) {
    messages.value.push(msg)
  }

  function setMessages(msgArray) {
    messages.value = msgArray
  }

  function setOnlineUsers(users) {
    onlineUsers.value = users
  }

  function openPrivateChat(withUser) {
    if (!privateChats.value[withUser]) {
      privateChats.value[withUser] = []
    }
    activePrivateChat.value = withUser
  }

  function closePrivateChat() {
    activePrivateChat.value = null
  }

  function addPrivateMessage(msg) {
    const otherUser = msg.from === username.value ? msg.to : msg.from
    if (!privateChats.value[otherUser]) {
      privateChats.value[otherUser] = []
    }
    privateChats.value[otherUser].push(msg)
  }

  function setPrivateHistory(withUser, history) {
    privateChats.value[withUser] = history
  }

  return {
    username, room, messages, onlineUsers,
    privateChats, activePrivateChat,
    setUser, addMessage, setMessages, setOnlineUsers,
    openPrivateChat, closePrivateChat,
    addPrivateMessage, setPrivateHistory
  }
})