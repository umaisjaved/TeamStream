<template>
  <div class="auth-page">

    <!-- Background -->
    <div class="background-glow"></div>

    <div class="auth-wrapper">

      <div class="auth-card card scale-in">

        <!-- Logo -->

        <div class="logo floating glow">
          💬
        </div>

        <!-- Heading -->

        <h1 class="auth-title">
          Team Stream
        </h1>

        <p class="auth-subtitle">
          {{ isLogin
              ? 'Welcome back! Continue your conversations.'
              : 'Create your account and start chatting.'
          }}
        </p>

        <!-- Form -->

        <div class="form">

          <!-- Username -->

          <div class="input-group">

            <label>Username</label>

            <input
              class="input"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              maxlength="20"
            />

          </div>

          <!-- Email -->

          <div
            v-if="!isLogin"
            class="input-group"
          >

            <label>Email</label>

            <input
              class="input"
              v-model="email"
              type="email"
              placeholder="Enter your email"
            />

          </div>

          <!-- Password -->

          <div class="input-group">

            <label>Password</label>

            <div class="password-wrapper">

              <input
                class="input"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
                @keyup.enter="submit"
              />

              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "🙈" : "👁" }}
              </button>

            </div>

          </div>

          <!-- Error -->

          <transition name="fade">

            <p
              v-if="error"
              class="error-message"
            >
              ⚠ {{ error }}
            </p>

          </transition>

          <!-- Success -->

          <transition name="fade">

            <p
              v-if="success"
              class="success-message"
            >
              ✅ {{ success }}
            </p>

          </transition>

          <!-- Button -->

          <button
            class="btn btn-primary submit-btn"
            @click="submit"
            :disabled="loading || !username.trim() || !password.trim()"
          >

            <span v-if="loading">

              {{ isLogin
                  ? "Logging in..."
                  : "Creating account..."
              }}

            </span>

            <span v-else>

              {{ isLogin
                  ? "Login"
                  : "Create Account"
              }}

            </span>

          </button>

        </div>

        <!-- Switch -->

        <div class="switch-mode">

          <span>

            {{ isLogin
                ? "Don't have an account?"
                : "Already have an account?"
            }}

          </span>

          <button
            class="switch-btn"
            @click="toggleMode"
          >

            {{ isLogin
                ? "Sign Up"
                : "Login"
            }}

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

const router = useRouter()
const authStore = useAuthStore()

/* ===========================
   STATE
=========================== */

const isLogin = ref(true)

const username = ref('')
const email = ref('')
const password = ref('')

const showPassword = ref(false)

const error = ref('')
const success = ref('')

const loading = ref(false)

/* ===========================
   TOGGLE LOGIN / SIGNUP
=========================== */

function toggleMode() {

  isLogin.value = !isLogin.value

  error.value = ''
  success.value = ''

  username.value = ''
  email.value = ''
  password.value = ''

}

/* ===========================
   SUBMIT
=========================== */

async function submit() {

  error.value = ''
  success.value = ''

  loading.value = true

  try {

    if (isLogin.value) {

      const res = await axios.post(
        'http://localhost:3000/api/auth/login',
        {
          username: username.value,
          password: password.value
        }
      )

      authStore.setAuth(res.data)

      router.push('/rooms')

    } else {

      await axios.post(
        'http://localhost:3000/api/auth/signup',
        {
          username: username.value,
          email: email.value,
          password: password.value
        }
      )

      success.value = 'Account created successfully! Please login.'

      isLogin.value = true

      password.value = ''

    }

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      'Something went wrong'

  } finally {

    loading.value = false

  }

}
</script>

<style scoped>

.auth-page{
    position:relative;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:40px 20px;
    overflow:hidden;
}

/* ===================================
   Animated Background
=================================== */

.background-glow{

    position:absolute;
    inset:0;

    background:
        radial-gradient(circle at 20% 20%, rgba(124,77,255,.22), transparent 30%),
        radial-gradient(circle at 80% 80%, rgba(6,182,212,.18), transparent 35%),
        radial-gradient(circle at center, rgba(59,130,246,.12), transparent 45%);

    filter:blur(80px);

    animation:floatBackground 12s ease-in-out infinite alternate;

    z-index:0;

}

@keyframes floatBackground{

    from{

        transform:
            translate(-3%,-3%)
            scale(1);

    }

    to{

        transform:
            translate(3%,3%)
            scale(1.08);

    }

}

/* ===================================
   Wrapper
=================================== */

.auth-wrapper{

    position:relative;

    width:100%;
    max-width:460px;

    z-index:2;

}

/* ===================================
   Card
=================================== */

.auth-card{

    display:flex;

    flex-direction:column;

    align-items:center;

    gap:22px;

    animation:slideUp .5s ease;

}

/* ===================================
   Logo
=================================== */

.logo{

    width:90px;
    height:90px;

    border-radius:50%;

    display:flex;
    justify-content:center;
    align-items:center;

    font-size:42px;

    background:var(--gradient-primary);

    color:white;

    box-shadow:var(--glow-primary);

}

/* ===================================
   Heading
=================================== */

.auth-title{

    margin:0;

    color:white;

    font-size:2.4rem;

    font-weight:800;

}

.auth-subtitle{

    text-align:center;

    color:var(--text-secondary);

    max-width:320px;

}

/* ===================================
   Form
=================================== */

.form{

    width:100%;

    display:flex;

    flex-direction:column;

    gap:18px;

}

/* ===================================
   Input
=================================== */

.input-group{

    display:flex;

    flex-direction:column;

    gap:8px;

}

.input-group label{

    color:var(--text-secondary);

    font-size:.92rem;

    font-weight:600;

}

/* ===================================
   Password
=================================== */

.password-wrapper{

    position:relative;

}

.toggle-password{

    position:absolute;

    top:50%;

    right:14px;

    transform:translateY(-50%);

    background:none;

    border:none;

    cursor:pointer;

    color:var(--text-secondary);

    font-size:18px;

    transition:.3s;

}

.toggle-password:hover{

    transform:translateY(-50%) scale(1.15);

}

/* ===================================
   Button
=================================== */

.submit-btn{

    width:100%;

    margin-top:8px;

    padding:15px;

    font-size:1rem;

}

/* ===================================
   Switch
=================================== */

.switch-mode{

    display:flex;

    justify-content:center;

    align-items:center;

    gap:8px;

    flex-wrap:wrap;

    color:var(--text-secondary);

}

.switch-btn{

    background:none;

    border:none;

    color:var(--primary);

    font-weight:700;

    cursor:pointer;

    transition:.3s;

}

.switch-btn:hover{

    color:white;

}

/* ===================================
   Messages
=================================== */

.error-message{

    color:#ff6b81;

    text-align:center;

    font-size:.92rem;

}

.success-message{

    color:#34d399;

    text-align:center;

    font-size:.92rem;

}

/* ===================================
   Fade Transition
=================================== */

.fade-enter-active,
.fade-leave-active{

    transition:opacity .25s ease;

}

.fade-enter-from,
.fade-leave-to{

    opacity:0;

}

/* ===================================
   Mobile
=================================== */

@media(max-width:600px){

.auth-card{

    padding:28px;

}

.auth-title{

    font-size:2rem;

}

.logo{

    width:72px;
    height:72px;

    font-size:34px;

}

}

</style>