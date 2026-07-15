<template>
  <div class="input-wrapper">

    <!-- Emoji Picker -->
    <div class="emoji-picker-container" v-if="showEmoji">
      <emoji-picker @emoji-click="onEmojiClick"></emoji-picker>
    </div>

    <div class="input-area">
      <button class="icon-btn" @click="showEmoji = !showEmoji">😊</button>
      <button class="icon-btn" @click="triggerFileInput">📎</button>

      <!-- Hidden file input -->
      <input
        type="file"
        ref="fileInput"
        @change="onFileSelected"
        accept="image/*,.pdf,.txt,.doc,.docx"
        style="display: none"
      />

      <input
        v-model="text"
        @keyup.enter="send"
        @input="onTyping"
        placeholder="Type a message and press Enter..."
        maxlength="500"
        ref="inputRef"
      />
      <button class="send-btn" @click="send" :disabled="!text.trim() && !selectedFile">
        Send
      </button>
    </div>

    <!-- File Preview -->
    <div v-if="selectedFile" class="file-preview">
      <img v-if="filePreviewUrl" :src="filePreviewUrl" class="preview-image" />
      <span v-else>📎 {{ selectedFile.name }}</span>
      <button @click="clearFile">✕</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const props = defineProps({ socket: Object, room: String })
const emit = defineEmits(['send'])
const authStore = useAuthStore()

const text = ref('')
const showEmoji = ref(false)
const inputRef = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)
const filePreviewUrl = ref(null)
const uploading = ref(false)
let typingTimeout = null

onMounted(() => {
  import('emoji-picker-element')
})

function onEmojiClick(event) {
  text.value += event.detail.unicode
  showEmoji.value = false
  inputRef.value?.focus()
}

function triggerFileInput() {
  fileInput.value.click()
}

function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file

  if (file.type.startsWith('image/')) {
    filePreviewUrl.value = URL.createObjectURL(file)
  } else {
    filePreviewUrl.value = null
  }
}

function clearFile() {
  selectedFile.value = null
  filePreviewUrl.value = null
  fileInput.value.value = ''
}

function onTyping() {
  if (props.socket) {
    props.socket.emit('typing', { room: props.room, isPrivate: false })
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      props.socket.emit('stopTyping', { room: props.room, isPrivate: false })
    }, 2000)
  }
}

async function send() {
  // Send file if selected
  if (selectedFile.value) {
    await sendFile()
    return
  }

  // Send text message
  if (text.value.trim()) {
    emit('send', text.value)
    text.value = ''
    showEmoji.value = false
    if (props.socket) {
      props.socket.emit('stopTyping', { room: props.room, isPrivate: false })
    }
  }
}

async function sendFile() {
  if (!selectedFile.value || uploading.value) return
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    if (props.socket) {
      props.socket.emit('sendFileMessage', {
        fileUrl: res.data.url,
        fileName: res.data.filename,
        isImage: res.data.isImage
      })
    }

    clearFile()
  } catch (err) {
    console.error('File upload error:', err)
    alert('File upload failed. Max size is 5MB.')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
}
.emoji-picker-container {
  position: absolute;
  bottom: 70px;
  left: 10px;
  z-index: 100;
}
.input-area {
  display: flex;
  padding: 16px;
  gap: 10px;
  border-top: 1px solid #333;
  align-items: center;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 4px;
}
.input-area input[type="text"],
.input-area input:not([type="file"]) {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #16213e;
  color: white;
  font-size: 1rem;
}
.send-btn {
  padding: 12px 24px;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.file-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: #16213e;
  border-top: 1px solid #333;
  color: white;
  font-size: 0.9rem;
}
.preview-image {
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}
.file-preview button {
  background: #e94560;
  border: none;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>