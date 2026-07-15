import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const email = ref(localStorage.getItem('email') || '')
  const avatar = ref(localStorage.getItem('avatar') || '')
  const bio = ref(localStorage.getItem('bio') || '')

  // ==========================
  // Login / Register
  // ==========================

  function setAuth(data) {

    token.value = data.token
    username.value = data.username
    email.value = data.email || ''
    avatar.value = data.avatar || ''
    bio.value = data.bio || ''

    localStorage.setItem('token', token.value)
    localStorage.setItem('username', username.value)
    localStorage.setItem('email', email.value)
    localStorage.setItem('avatar', avatar.value)
    localStorage.setItem('bio', bio.value)

  }

  // ==========================
  // Update Profile
  // ==========================

  function updateProfile(data) {

    if (data.email !== undefined) {
      email.value = data.email
      localStorage.setItem('email', data.email)
    }

    if (data.bio !== undefined) {
      bio.value = data.bio
      localStorage.setItem('bio', data.bio)
    }

    if (data.avatar !== undefined) {
      avatar.value = data.avatar
      localStorage.setItem('avatar', data.avatar)
    }

  }

  // ==========================
  // Logout
  // ==========================

  function logout() {

    token.value = ''
    username.value = ''
    email.value = ''
    avatar.value = ''
    bio.value = ''

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('avatar')
    localStorage.removeItem('bio')

  }

  // ==========================
  // Helper
  // ==========================

  function isLoggedIn() {
    return !!token.value
  }

  return {
    token,
    username,
    email,
    avatar,
    bio,
    setAuth,
    updateProfile,
    logout,
    isLoggedIn
  }

})