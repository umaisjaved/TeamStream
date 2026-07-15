<template>
  <div class="page">
    <AppHeader title="Join a Room" backTo="/rooms" />

    <div class="page-content">

      <!-- Join by Code -->
      <div class="form-card">
        <h3>🔑 Join by Room Code</h3>
        <p class="subtitle">Enter the code shared by the room creator</p>

        <div class="code-input-row">
          <input
            v-model="roomCode"
            type="text"
            placeholder="Enter code e.g. AB12CD"
            maxlength="6"
            @keyup.enter="joinByCode"
            style="text-transform: uppercase"
          />
          <button @click="joinByCode" :disabled="loadingCode || roomCode.length < 4">
            {{ loadingCode ? '...' : 'Join' }}
          </button>
        </div>

        <p v-if="codeError" class="error">⚠️ {{ codeError }}</p>
      </div>

      <!-- OR Divider -->
      <div class="divider"><span>OR</span></div>

      <!-- Browse Public Rooms -->
      <div class="form-card">
        <h3>🌍 Browse Public Rooms</h3>

        <div class="search-row">
          <input
            v-model="searchQuery"
            @input="searchRooms"
            type="text"
            placeholder="Search rooms..."
          />
        </div>

        <!-- Loading -->
        <div v-if="loadingRooms" class="status">Loading rooms...</div>

        <!-- Empty -->
        <div v-else-if="rooms.length === 0" class="status">
          No rooms found. Create one!
        </div>

        <!-- Rooms List -->
        <div v-else class="rooms-list">
          <div
            v-for="room in rooms"
            :key="room._id"
            class="room-item"
            @click="joinPublicRoom(room)"
          >
            <div class="room-info">
              <span class="room-name"># {{ room.name }}</span>
              <span class="room-desc">{{ room.description || 'No description' }}</span>
              <span class="room-meta">Created by {{ room.createdBy }}</span>
            </div>
            <button class="btn-join">Join →</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const roomCode = ref('')
const searchQuery = ref('')
const rooms = ref([])
const loadingCode = ref(false)
const loadingRooms = ref(false)
const codeError = ref('')

let searchTimeout = null

onMounted(() => fetchRooms())

async function fetchRooms(query = '') {
  loadingRooms.value = true
  try {
    const res = await axios.get('http://localhost:3000/api/rooms/search', {
      params: { query },
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    rooms.value = res.data
  } catch (err) {
    console.error('Error fetching rooms:', err)
  } finally {
    loadingRooms.value = false
  }
}

function searchRooms() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchRooms(searchQuery.value), 400)
}

async function joinByCode() {
  codeError.value = ''
  if (roomCode.value.length < 4) return
  loadingCode.value = true

  try {
    const res = await axios.post('http://localhost:3000/api/rooms/join', {
      roomCode: roomCode.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    chatStore.setUser(authStore.username, res.data.name)
    router.push('/chat')
  } catch (err) {
    codeError.value = err.response?.data?.message || 'Invalid room code'
  } finally {
    loadingCode.value = false
  }
}

function joinPublicRoom(room) {
  chatStore.setUser(authStore.username, room.name)
  router.push('/chat')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
}
.page-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}
.form-card {
  background: #16213e;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-card h3 { margin: 0; font-size: 1rem; }
.subtitle { color: #aaa; font-size: 0.85rem; margin: 0; }
.code-input-row {
  display: flex;
  gap: 10px;
}
.code-input-row input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f3460;
  color: white;
  font-size: 1.1rem;
  letter-spacing: 4px;
  text-align: center;
}
.code-input-row button {
  padding: 12px 20px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.code-input-row button:disabled { opacity: 0.5; cursor: not-allowed; }
.search-row input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f3460;
  color: white;
  font-size: 0.95rem;
  box-sizing: border-box;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #555;
  font-size: 0.85rem;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #333;
}
.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #0f3460;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.room-item:hover { background: #1a3a6e; }
.room-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.room-name { font-weight: bold; color: white; font-size: 0.95rem; }
.room-desc { color: #aaa; font-size: 0.8rem; }
.room-meta { color: #555; font-size: 0.75rem; }
.btn-join {
  padding: 8px 14px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}
.status { text-align: center; color: #aaa; padding: 20px 0; }
.error { color: #e94560; font-size: 0.85rem; margin: 0; }
</style>