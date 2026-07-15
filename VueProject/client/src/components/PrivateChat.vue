<template>
  <div class="dm-panel">
    <div class="dm-header">
      <span>💬 {{ store.activePrivateChat }}</span>
      <button @click="store.closePrivateChat()">✕</button>
    </div>

    <div class="dm-messages" ref="msgBox">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['dm-msg', msg.from === store.username ? 'mine' : 'theirs']"
      >
        <p class="msg-text">{{ msg.text }}</p>
        <span class="msg-time">{{ msg.time }}</span>
      </div>
      <p v-if="messages.length === 0" class="empty">
        No messages yet. Say hi! 👋
      </p>
    </div>

    <div class="dm-typing" v-if="isTyping">typing...</div>

    <div class="dm-input">
      <input
        v-model="text"
        @keyup.enter="send"
        @input="onTyping"
        placeholder="Send a private message..."
      />
      <button @click="send">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../stores/chat'

const props = defineProps({ socket: Object })
const store = useChatStore()
const text = ref('')
const msgBox = ref(null)
const isTyping = ref(false)
let typingTimeout = null

const messages = computed(() => {
  return store.privateChats[store.activePrivateChat] || []
})

watch(() => store.activePrivateChat, (newUser) => {
  if (newUser && props.socket) {
    props.socket.emit('loadPrivateHistory', { withUser: newUser })
  }
}, { immediate: true })

watch(() => messages.value.length, async () => {
  await nextTick()
  if (msgBox.value) {
    msgBox.value.scrollTop = msgBox.value.scrollHeight
  }
})

onMounted(() => {
  if (props.socket) {
    props.socket.on('userTyping', ({ isPrivate }) => {
      if (isPrivate) isTyping.value = true
    })
    props.socket.on('userStopTyping', ({ isPrivate }) => {
      if (isPrivate) isTyping.value = false
    })
  }
})

onUnmounted(() => {
  isTyping.value = false
})

function onTyping() {
  if (props.socket) {
    props.socket.emit('typing', {
      isPrivate: true,
      to: store.activePrivateChat
    })
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      props.socket.emit('stopTyping', {
        isPrivate: true,
        to: store.activePrivateChat
      })
    }, 2000)
  }
}

function send() {
  if (text.value.trim() && props.socket) {
    props.socket.emit('sendPrivateMessage', {
      to: store.activePrivateChat,
      text: text.value
    })
    text.value = ''
    props.socket.emit('stopTyping', {
      isPrivate: true,
      to: store.activePrivateChat
    })
  }
}
</script>

<style scoped>
.dm-panel {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 320px;
  height: 420px;
  background: #16213e;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
  z-index: 1000;
}
.dm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #0f3460;
  border-radius: 12px 12px 0 0;
  color: white;
  font-weight: bold;
}
.dm-header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}
.dm-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dm-msg {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mine { align-self: flex-end; align-items: flex-end; }
.theirs { align-self: flex-start; }
.msg-text {
  margin: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: #0f3460;
  color: white;
  font-size: 0.9rem;
}
.mine .msg-text { background: #e94560; }
.msg-time { font-size: 0.7rem; color: #777; }
.empty { color: #aaa; text-align: center; margin-top: 20px; }
.dm-typing {
  font-size: 0.75rem;
  color: #aaa;
  font-style: italic;
  padding: 0 12px 4px;
}
.dm-input {
  display: flex;
  padding: 10px;
  gap: 8px;
  border-top: 1px solid #333;
}
.dm-input input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f3460;
  color: white;
  font-size: 0.9rem;
}
.dm-input button {
  padding: 8px 14px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>