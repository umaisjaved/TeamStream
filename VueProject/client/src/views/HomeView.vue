<template>
  <div class="home-page">

    <!-- Premium Header -->
    <AppHeader
      title="Team Stream"
      subtitle="Welcome back, keep the conversation going."
      :showBack="false"
    >
      <template #right>

        <button
          class="profile-button"
          @click="router.push('/profile')"
        >
          <div class="avatar">

            {{ authStore.username.charAt(0).toUpperCase() }}

          </div>

          <span>

            {{ authStore.username }}

          </span>

        </button>

      </template>

    </AppHeader>

    <!-- Quick Join -->

    <section class="section">

      <h2 class="section-title">

        Quick Join

      </h2>

      <div class="room-grid">

        <RoomCard
          v-for="room in defaultRooms"
          :key="room.name"
          :title="room.name"
          :description="room.desc"
          :icon="room.icon"
          :members="room.members"
          @click="joinRoom(room.name)"
        />

      </div>

    </section>

    <!-- Actions -->

    <section class="section">

      <h2 class="section-title">

        Quick Actions

      </h2>

      <div class="action-list">

        <ActionCard
          title="Join Room"
          subtitle="Join with a room code"
          :icon="LogIn"
          @click="router.push('/join-room')"
        />

        <ActionCard
          title="Create Room"
          subtitle="Create a new conversation"
          :icon="Plus"
          @click="router.push('/create-room')"
        />

        <ActionCard
          title="Search Groups"
          subtitle="Find communities"
          :icon="Search"
          @click="router.push('/search-groups')"
        />

        <ActionCard
          title="My Profile"
          subtitle="Settings & Account"
          :icon="User"
          @click="router.push('/profile')"
        />

      </div>

    </section>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'

import AppHeader from '../components/AppHeader.vue'
import RoomCard from '../components/room/RoomCard.vue'
import ActionCard from '../components/room/ActionCard.vue'

import {
  User,
  Search,
  Plus,
  LogIn
} from 'lucide-vue-next'

const router = useRouter()
const store = useChatStore()
const authStore = useAuthStore()

const defaultRooms = [
  {
    name: 'General',
    icon: '🌍',
    desc: 'General discussions',
    members: 124
  },
  {
    name: 'Tech',
    icon: '💻',
    desc: 'Technology & Programming',
    members: 89
  },
  {
    name: 'Random',
    icon: '🎲',
    desc: 'Fun & Off-topic conversations',
    members: 56
  }
]

function joinRoom(roomName) {
  store.setUser(authStore.username, roomName)
  router.push('/chat')
}
</script>

<style scoped>

.home-page{

    min-height:100vh;

    padding:32px;

    background:
        radial-gradient(circle at top right,
        rgba(124,77,255,.15),
        transparent 35%),
        radial-gradient(circle at bottom left,
        rgba(59,130,246,.12),
        transparent 30%);

    display:flex;

    flex-direction:column;

    gap:32px;

}

.section{

    display:flex;

    flex-direction:column;

    gap:18px;

}

.section-title{

    margin:0;

    color:white;

    font-size:1.25rem;

    font-weight:700;

    letter-spacing:.5px;

}

.room-grid{

    display:grid;

    grid-template-columns:
        repeat(auto-fit,minmax(240px,1fr));

    gap:22px;

}

.action-list{

    display:flex;

    flex-direction:column;

    gap:18px;

}

.profile-button{

    display:flex;

    align-items:center;

    gap:12px;

    border:none;

    cursor:pointer;

    border-radius:50px;

    padding:10px 18px;

    color:white;

    background:rgba(255,255,255,.06);

    transition:.3s;

}

.profile-button:hover{

    transform:translateY(-2px);

    box-shadow:var(--glow-primary);

}

.avatar{

    width:42px;

    height:42px;

    border-radius:50%;

    background:var(--gradient-primary);

    display:flex;

    justify-content:center;

    align-items:center;

    font-weight:700;

    color:white;

    box-shadow:var(--glow-primary);

}

@media(max-width:768px){

.home-page{

    padding:18px;

}

.room-grid{

    grid-template-columns:1fr;

}

}

</style>