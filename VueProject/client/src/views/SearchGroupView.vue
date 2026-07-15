<template>
  <div class="page">
    <AppHeader title="Search Groups" backTo="/rooms" />

    <div class="page-content">
      <div class="search-box">
        <input
          v-model="query"
          @input="search"
          type="text"
          placeholder="Search groups by name..."
          ref="searchInput"
          autofocus
        />
      </div>

      <div v-if="loading" class="status">Searching...</div>

      <div v-else-if="query && results.length === 0" class="status">
        No groups found for "{{ query }}"
      </div>

      <div v-else-if="!query" class="status">
        Type to search for groups
      </div>

      <div v-else class="results-list">
        <div
          v-for="room in results"
          :key="room._id"
          class="result-item"
        >
          <div class="result-info">
            <span class="result-name"># {{ room.name }}</span>
            <span class="result-desc">{{ room.description || 'No description' }}</span>
            <span class="result-meta">Created by {{ room.createdBy }}</span>
          </div>
          <button class="btn-join" @click="joinRoom(room)">
            Join →
          </button>
        </div>
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

const query = ref('')
const results = ref([])
const loading = ref(false)
let searchTimeout = null

async function search() {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  loading.value = true
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/rooms/search', {
        params: { query: query.value },
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      results.value = res.data
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      loading.value = false
    }
  }, 400)
}

function joinRoom(room) {
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}
.search-box input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #333;
  background: #16213e;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
}
.search-box input:focus {
  outline: none;
  border-color: #e94560;
}
.status {
  text-align: center;
  color: #aaa;
  padding: 40px 0;
}
.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #16213e;
  border-radius: 12px;
  border: 1px solid #333;
}
.result-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.result-name { font-weight: bold; color: white; }
.result-desc { color: #aaa; font-size: 0.85rem; }
.result-meta { color: #555; font-size: 0.75rem; }
.btn-join {
  padding: 10px 16px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-join:hover { opacity: 0.85; }
</style>