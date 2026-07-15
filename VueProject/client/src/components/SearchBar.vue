<template>
  <div class="search-overlay">

    <!-- Search Header -->
    <div class="search-header">
      <input
        v-model="query"
        @input="search"
        placeholder="Search messages..."
        ref="searchInput"
        autofocus
      />
      <button @click="$emit('close')">✕ Close</button>
    </div>

    <!-- Room Filter -->
    <div class="search-filters">
      <span>Filter by room:</span>
      <button
        :class="{ active: selectedRoom === '' }"
        @click="selectedRoom = ''; search()"
      >All</button>
      <button
        v-for="room in rooms"
        :key="room"
        :class="{ active: selectedRoom === room }"
        @click="selectedRoom = room; search()"
      >{{ room }}</button>
    </div>

    <!-- Results -->
    <div class="search-results">

      <!-- Loading -->
      <div v-if="loading" class="status">Searching...</div>

      <!-- No results -->
      <div v-else-if="query && results.length === 0" class="status">
        No messages found for "{{ query }}"
      </div>

      <!-- Empty state -->
      <div v-else-if="!query" class="status">
        Type something to search through messages
      </div>

      <!-- Results list -->
      <div
        v-for="msg in results"
        :key="msg.id"
        class="result-item"
      >
        <div class="result-meta">
          <span class="result-user">{{ msg.username }}</span>
          <span class="result-room"># {{ msg.room }}</span>
          <span class="result-time">{{ msg.time }}</span>
        </div>
        <p class="result-text" v-html="highlight(msg.text)"></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

defineEmits(['close'])

const authStore = useAuthStore()
const query = ref('')
const results = ref([])
const loading = ref(false)
const selectedRoom = ref('')
const rooms = ['General', 'Tech', 'Random']
const searchInput = ref(null)

let searchTimeout = null

onMounted(() => {
  searchInput.value?.focus()
})

async function search() {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  loading.value = true
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    try {
      const params = { query: query.value }
      if (selectedRoom.value) params.room = selectedRoom.value

      const res = await axios.get('http://localhost:3000/api/messages/search', {
        params,
        headers: { Authorization: `Bearer ${authStore.token}` }
      })

      results.value = res.data
    } catch (err) {
      console.error('Search error:', err)
      results.value = []
    } finally {
      loading.value = false
    }
  }, 400)
}

// Highlight matching text
function highlight(text) {
  if (!query.value) return text
  const regex = new RegExp(`(${query.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a2e;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}
.search-header {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #16213e;
  border-bottom: 1px solid #333;
}
.search-header input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f3460;
  color: white;
  font-size: 1rem;
}
.search-header button {
  padding: 12px 20px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.search-filters {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  align-items: center;
  background: #16213e;
  border-bottom: 1px solid #333;
  color: #aaa;
  font-size: 0.85rem;
}
.search-filters button {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #333;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 0.85rem;
}
.search-filters button.active {
  background: #e94560;
  color: white;
  border-color: #e94560;
}
.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.status {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
}
.result-item {
  background: #16213e;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #333;
}
.result-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 0.8rem;
}
.result-user { color: #e94560; font-weight: bold; }
.result-room { color: #aaa; }
.result-time { color: #555; margin-left: auto; }
.result-text {
  margin: 0;
  color: white;
  font-size: 0.95rem;
}
.result-text :deep(mark) {
  background: #e94560;
  color: white;
  border-radius: 3px;
  padding: 0 2px;
}
</style>