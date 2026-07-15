<template>
  <ul class="user-list">
    <li
      v-for="user in users"
      :key="user.username"
      @click="openDM(user.username)"
      :class="{ self: user.username === currentUser }"
    >
      🟢 {{ user.username }}
      <span v-if="user.username !== currentUser" class="dm-hint">💬</span>
    </li>
  </ul>
</template>

<script setup>
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'

const store = useChatStore()
const authStore = useAuthStore()
const currentUser = authStore.username

defineProps({ users: Array })

function openDM(username) {
  if (username === currentUser) return
  store.openPrivateChat(username)
}
</script>

<style scoped>
.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.user-list li {
  padding: 8px 0;
  color: #ccc;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  padding: 8px;
}
.user-list li:hover {
  background: #0f3460;
}
.self {
  cursor: default !important;
  opacity: 0.6;
}
.dm-hint {
  font-size: 0.8rem;
  opacity: 0.6;
}
</style>