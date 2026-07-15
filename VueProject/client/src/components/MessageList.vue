<template>
  <div class="messages" ref="messageBox">
    <div v-for="(msg, index) in messages" :key="index">

      <!-- Notification -->
      <div v-if="msg.type === 'notification'" class="notification">
        {{ msg.text }}
      </div>

      <!-- Regular Message -->
      <div
        v-else
        :class="['message', msg.username === currentUser ? 'mine' : 'theirs']"
      >
        <span class="msg-user">{{ msg.username }}</span>

        <!-- Text message -->
        <p v-if="msg.text" class="msg-text">{{ msg.text }}</p>

        <!-- Image -->
        <div v-if="msg.fileUrl && msg.isImage" class="msg-image">
          <img
            :src="msg.fileUrl"
            :alt="msg.fileName"
            @click="openImage(msg.fileUrl)"
          />
        </div>

        <!-- File (non-image) -->
        <div v-if="msg.fileUrl && !msg.isImage" class="msg-file">
          <a :href="msg.fileUrl" target="_blank" download>
            📎 {{ msg.fileName }}
          </a>
        </div>

        <span class="msg-time">{{ msg.time }}</span>
      </div>

    </div>

    <!-- Image Lightbox -->
    <div v-if="lightboxImage" class="lightbox" @click="lightboxImage = null">
      <img :src="lightboxImage" />
    </div>

  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: Array,
  currentUser: String
})

const messageBox = ref(null)
const lightboxImage = ref(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight
  }
})

function openImage(url) {
  lightboxImage.value = url
}
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.notification {
  text-align: center;
  color: #aaa;
  font-size: 0.85rem;
  padding: 4px 0;
}
.message {
  max-width: 60%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mine { align-self: flex-end; align-items: flex-end; }
.theirs { align-self: flex-start; }
.msg-user { font-size: 0.8rem; color: #aaa; }
.msg-text {
  margin: 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: #0f3460;
  color: white;
}
.mine .msg-text { background: #e94560; }
.msg-time { font-size: 0.75rem; color: #777; }
.msg-image img {
  max-width: 250px;
  max-height: 200px;
  border-radius: 10px;
  cursor: pointer;
  object-fit: cover;
}
.msg-file {
  padding: 10px 14px;
  border-radius: 12px;
  background: #0f3460;
}
.mine .msg-file { background: #e94560; }
.msg-file a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}
.lightbox img {
  max-width: 90%;
  max-height: 90vh;
  border-radius: 8px;
}
</style>