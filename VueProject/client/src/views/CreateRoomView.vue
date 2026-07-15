<template>
  <div class="page">
    <AppHeader title="Create a Room" backTo="/rooms" />

    <div class="page-content">
      <div class="form-card">
        <h3>Room Details</h3>

        <div class="field">
          <label>Room Name *</label>
          <input
            v-model="name"
            type="text"
            placeholder="e.g. Design Team, Study Group..."
            maxlength="30"
          />
          <span class="hint">{{ name.length }}/30</span>
        </div>

        <div class="field">
          <label>Description</label>
          <textarea
            v-model="description"
            placeholder="What is this room about?"
            rows="3"
            maxlength="100"
          />
        </div>

        <div class="field checkbox-field">
          <input type="checkbox" id="private" v-model="isPrivate" />
          <label for="private">🔒 Private Room (join by code only)</label>
        </div>

        <p v-if="error" class="error">⚠️ {{ error }}</p>
        <p v-if="success" class="success">✅ {{ success }}</p>

        <button
          class="btn-create"
          @click="createRoom"
          :disabled="loading || !name.trim()"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>✨ Create Room</span>
        </button>
      </div>

      <!-- Success Card showing Room Code -->
      <div v-if="createdRoom" class="room-code-card">
        <h3>🎉 Room Created!</h3>
        <p>Share this code with others to invite them:</p>
        <div class="code-box">{{ createdRoom.roomCode }}</div>
        <button class="btn-join-now" @click="joinNewRoom">
          Join Room Now →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const name = ref('')
const description = ref('')
const isPrivate = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const createdRoom = ref(null)

async function createRoom() {
  error.value = ''
  success.value = ''

  if (name.value.trim().length < 2) {
    error.value = 'Room name must be at least 2 characters'
    return
  }

  loading.value = true
  try {
    const res = await axios.post('http://localhost:3000/api/rooms/create', {
      name: name.value,
      description: description.value,
      isPrivate: isPrivate.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    createdRoom.value = res.data
    success.value = 'Room created successfully!'
    name.value = ''
    description.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create room'
  } finally {
    loading.value = false
  }
}

function joinNewRoom() {
  chatStore.setUser(authStore.username, createdRoom.value.name)
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
  gap: 20px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}
.form-card {
  background: #16213e;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-card h3 { margin: 0; color: #aaa; font-size: 0.9rem; text-transform: uppercase; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { color: #aaa; font-size: 0.85rem; }
.field input[type="text"],
.field textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f3460;
  color: white;
  font-size: 0.95rem;
  resize: vertical;
}
.field input:focus, .field textarea:focus {
  outline: none;
  border-color: #e94560;
}
.hint { color: #555; font-size: 0.75rem; text-align: right; }
.checkbox-field {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.checkbox-field label { color: #ccc; font-size: 0.9rem; }
.btn-create {
  padding: 13px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-create:hover:not(:disabled) { opacity: 0.85; }
.room-code-card {
  background: #16213e;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #4caf50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.room-code-card h3 { margin: 0; }
.room-code-card p { color: #aaa; margin: 0; }
.code-box {
  background: #0f3460;
  padding: 16px 32px;
  border-radius: 10px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 6px;
  color: #e94560;
}
.btn-join-now {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
}
.error { color: #e94560; font-size: 0.85rem; margin: 0; }
.success { color: #4caf50; font-size: 0.85rem; margin: 0; }
</style>