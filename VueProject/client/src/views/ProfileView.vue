<template>
  <div class="profile-page">

    <AppHeader
      title="My Profile"
      backTo="/rooms"
    />

    <div class="profile-content">

      <!-- Avatar Section -->
      <div class="avatar-section">

        <img
          v-if="authStore.avatar"
          :src="authStore.avatar"
          class="avatar-img"
        />

        <div
          v-else
          class="avatar"
        >
          {{ authStore.username.charAt(0).toUpperCase() }}
        </div>

        <h2>{{ authStore.username }}</h2>

        <p class="joined">
          Member of Team Stream
        </p>

        <input
          id="avatarInput"
          type="file"
          hidden
          accept="image/*"
          @change="chooseAvatar"
        />

        <div class="photo-buttons">

          <label
            for="avatarInput"
            class="btn-photo upload"
          >
            📤 Upload Photo
          </label>

          <button
            v-if="selectedFile"
            class="btn-photo save"
            @click="uploadAvatar"
            :disabled="uploading"
          >
            {{ uploading ? 'Uploading...' : 'Save Photo' }}
          </button>

          <button
            v-if="authStore.avatar"
            class="btn-photo remove"
            @click="removeAvatar"
          >
            🗑 Remove Photo
          </button>

        </div>

      </div>

      <!-- Profile Information -->

      <div class="info-card">

        <h3>
          Profile Information
        </h3>

        <div class="info-row">
          <label>Username</label>
          <span>{{ authStore.username }}</span>
        </div>

        <div class="info-row">

          <label>Email</label>

          <input
            v-if="editing"
            v-model="email"
            type="email"
            placeholder="Enter your email"
          />

          <span v-else>
            {{ authStore.email || 'Not set' }}
          </span>

        </div>

        <div class="info-row">

          <label>Bio</label>

          <textarea
            v-if="editing"
            v-model="bio"
            rows="3"
            placeholder="Tell something about yourself..."
          />

          <span v-else>
            {{ authStore.bio || 'No bio yet' }}
          </span>

        </div>

        <p
          v-if="saveSuccess"
          class="success"
        >
          ✅ Profile updated!
        </p>

        <p
          v-if="saveError"
          class="error"
        >
          ⚠️ {{ saveError }}
        </p>

        <div class="btn-row">

          <button
            v-if="!editing"
            class="btn-edit"
            @click="startEdit"
          >
            ✏️ Edit Profile
          </button>

          <template v-else>

            <button
              class="btn-cancel"
              @click="cancelEdit"
            >
              Cancel
            </button>

            <button
              class="btn-save"
              @click="saveProfile"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>

          </template>

        </div>

      </div>

      <button
        class="btn-logout"
        @click="showLogoutDialog = true"
      >
        🚪 Logout
      </button>

    </div>

    <AppDialog
      v-if="showLogoutDialog"
      title="Logout"
      message="Are you sure you want to logout?"
      confirmText="Yes, Logout"
      cancelText="Stay"
      @confirm="handleLogout"
      @cancel="showLogoutDialog = false"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'

import AppHeader from '../components/AppHeader.vue'
import AppDialog from '../components/AppDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

// =========================
// Profile
// =========================

const editing = ref(false)
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

const email = ref(authStore.email)
const bio = ref(authStore.bio)

// =========================
// Avatar
// =========================

const selectedFile = ref(null)
const uploading = ref(false)

function chooseAvatar(event) {
  selectedFile.value = event.target.files[0]
}

async function uploadAvatar() {

  if (!selectedFile.value) return

  uploading.value = true
  saveError.value = ''

  try {

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await axios.post(
      'http://localhost:3000/api/upload/avatar',
      formData,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    authStore.updateProfile({
      avatar: res.data.avatar
    })

    saveSuccess.value = true

    selectedFile.value = null

    setTimeout(() => {
      saveSuccess.value = false
    }, 2500)

  }
  catch (err) {

    saveError.value =
      err.response?.data?.message ||
      'Failed to upload profile picture'

  }
  finally {

    uploading.value = false

  }

}

async function removeAvatar() {

  try {

    await axios.delete(
      'http://localhost:3000/api/upload/avatar',
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    )

    authStore.updateProfile({
      avatar: ''
    })

    saveSuccess.value = true

    setTimeout(() => {
      saveSuccess.value = false
    }, 2500)

  }
  catch (err) {

    saveError.value =
      err.response?.data?.message ||
      'Failed to remove profile picture'

  }

}

// =========================
// Edit Profile
// =========================

function startEdit() {

  email.value = authStore.email
  bio.value = authStore.bio

  editing.value = true

  saveSuccess.value = false
  saveError.value = ''

}

function cancelEdit() {

  editing.value = false
  saveError.value = ''

}

async function saveProfile() {

  saving.value = true
  saveError.value = ''

  try {

    const res = await axios.put(
      'http://localhost:3000/api/auth/profile',
      {
        email: email.value,
        bio: bio.value
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    )

    authStore.updateProfile(res.data)

    editing.value = false

    saveSuccess.value = true

    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)

  }
  catch (err) {

    saveError.value =
      err.response?.data?.message ||
      'Failed to update profile'

  }
  finally {

    saving.value = false

  }

}

// =========================
// Logout
// =========================

const showLogoutDialog = ref(false)

function handleLogout() {

  authStore.logout()

  chatStore.setUser('', '')

  router.push('/login')

}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
}

.profile-content {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===========================
   Avatar Card
=========================== */

.avatar-section {
  background: #16213e;
  border: 1px solid #333;
  border-radius: 18px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar,
.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.avatar {
  background: #e94560;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.avatar-img {
  object-fit: cover;
  border: 4px solid #e94560;
}

.avatar-section h2 {
  margin-top: 18px;
  margin-bottom: 4px;
  font-size: 1.5rem;
}

.joined {
  color: #9ca3af;
  margin-bottom: 20px;
}

/* ===========================
   Upload Buttons
=========================== */

.photo-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.btn-photo {
  flex: 1;
  min-width: 170px;
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
  user-select: none;
}

.upload {
  background: #e94560;
  color: white;
}

.upload:hover {
  background: #ff5d78;
}

.save {
  background: #16a34a;
  color: white;
  border: none;
}

.save:hover {
  background: #22c55e;
}

.remove {
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
}

.remove:hover {
  background: #ef4444;
  color: white;
}

/* ===========================
   Profile Card
=========================== */

.info-card {
  background: #16213e;
  border: 1px solid #333;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-card h3 {
  margin: 0;
  color: #9ca3af;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row label {
  color: #9ca3af;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.info-row span {
  color: white;
}

.info-row input,
.info-row textarea {
  padding: 12px 14px;
  background: #0f3460;
  border: 1px solid #333;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  resize: vertical;
}

.info-row input:focus,
.info-row textarea:focus {
  outline: none;
  border-color: #e94560;
}

/* ===========================
   Buttons
=========================== */

.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-edit,
.btn-save {
  background: #e94560;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.25s;
}

.btn-edit:hover,
.btn-save:hover {
  background: #ff5d78;
}

.btn-cancel {
  background: transparent;
  color: #aaa;
  border: 1px solid #555;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #2a2a45;
}

.btn-logout {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  background: transparent;
  border: 2px solid #e94560;
  color: #e94560;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.25s;
}

.btn-logout:hover {
  background: #e94560;
  color: white;
}

/* ===========================
   Messages
=========================== */

.success {
  color: #22c55e;
  font-size: 0.9rem;
}

.error {
  color: #ef4444;
  font-size: 0.9rem;
}

/* ===========================
   Mobile
=========================== */

@media (max-width: 600px) {

  .photo-buttons {
    flex-direction: column;
  }

  .btn-photo {
    width: 100%;
  }

  .btn-row {
    flex-direction: column;
  }

  .btn-edit,
  .btn-save,
  .btn-cancel {
    width: 100%;
  }

}
</style>