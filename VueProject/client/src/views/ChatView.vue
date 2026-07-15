<template>
  <div class="chat-container">

    <div class="chat-layout">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <button class="back-home" @click="router.push('/rooms')">← Rooms</button>
        </div>
        <h2>💬 {{ store.room }}</h2>

        <div class="sound-toggle" @click="soundEnabled = !soundEnabled">
          {{ soundEnabled ? '🔔 Sound On' : '🔕 Sound Off' }}
        </div>

        <div class="search-btn" @click="showSearch = true">
          🔍 Search Messages
        </div>

        <h4>Online Users</h4>
        <UserList :users="store.onlineUsers" />

        <div class="sidebar-footer">
          <button class="profile-mini" @click="router.push('/profile')">
            👤 {{ store.username }}
          </button>
        </div>
      </aside>

      <!-- Main Chat -->
      <main class="chat-main">
        <MessageList
          :messages="store.messages"
          :currentUser="store.username"
        />

        <div class="typing-indicator" v-if="typingUsers.length > 0">
          {{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'is' : 'are' }} typing...
        </div>

        <MessageInput
          @send="sendMessage"
          :socket="socket"
          :room="store.room"
        />
      </main>

    </div>

    <!-- Private Chat Panel -->
    <PrivateChat
      v-if="store.activePrivateChat"
      :socket="socket"
    />

    <!-- Search Overlay -->
    <SearchBar
      v-if="showSearch"
      @close="showSearch = false"
    />

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { io } from 'socket.io-client'
import { useChatStore } from '../stores/chat'
import { useSound } from '../composables/useSound'
import MessageList from '../components/MessageList.vue'
import MessageInput from '../components/MessageInput.vue'
import UserList from '../components/UserList.vue'
import PrivateChat from '../components/PrivateChat.vue'
import SearchBar from '../components/SearchBar.vue'

const store = useChatStore()
const router = useRouter()
const { playMessageSound, playPrivateMessageSound, playJoinSound } = useSound()

if (!store.username) router.push('/')

const socket = ref(null)
const typingUsers = ref([])
const soundEnabled = ref(true)
const showSearch = ref(false)

onMounted(() => {
  socket.value = io('http://localhost:3000')

  socket.value.emit('joinRoom', {
    username: store.username,
    room: store.room
  })

  socket.value.on('messageHistory', (history) => store.setMessages(history))

  socket.value.on('message', (msg) => {
    store.addMessage(msg)
    if (msg.username !== store.username && soundEnabled.value) {
      playMessageSound()
    }
  })

  socket.value.on('notification', (text) => {
    store.addMessage({ type: 'notification', text })
    if (soundEnabled.value) playJoinSound()
  })

  socket.value.on('roomUsers', (users) => store.setOnlineUsers(users))

  socket.value.on('privateMessage', (msg) => {
    store.addPrivateMessage(msg)
    if (msg.from !== store.username && soundEnabled.value) {
      playPrivateMessageSound()
    }
    if (!store.activePrivateChat) {
      const otherUser = msg.from === store.username ? msg.to : msg.from
      store.openPrivateChat(otherUser)
    }
  })

  socket.value.on('privateHistory', (history) => {
    store.setPrivateHistory(store.activePrivateChat, history)
  })

  socket.value.on('userTyping', ({ username, isPrivate }) => {
    if (!isPrivate && !typingUsers.value.includes(username)) {
      typingUsers.value.push(username)
    }
  })

  socket.value.on('userStopTyping', ({ username, isPrivate }) => {
    if (!isPrivate) {
      typingUsers.value = typingUsers.value.filter(u => u !== username)
    }
  })
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }
})

function sendMessage(text) {
  if (socket.value) {
    socket.value.emit('sendMessage', text)
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
}
.chat-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.sidebar {
  width: 220px;
  background: #16213e;
  padding: 16px;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar-header {
  margin-bottom: 4px;
}
.back-home {
  background: #0f3460;
  border: none;
  color: #ccc;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  width: 100%;
  text-align: left;
}
.back-home:hover { background: #e94560; color: white; }
.sound-toggle, .search-btn {
  background: #0f3460;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
  color: #ccc;
}
.sound-toggle:hover, .search-btn:hover {
  background: #e94560;
  color: white;
}
.sidebar-footer {
  margin-top: auto;
}
.profile-mini {
  width: 100%;
  padding: 10px;
  background: #0f3460;
  border: none;
  color: #ccc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
}
.profile-mini:hover { background: #e94560; color: white; }
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.typing-indicator {
  padding: 4px 20px;
  color: #aaa;
  font-size: 0.85rem;
  font-style: italic;
  min-height: 24px;
}
</style>