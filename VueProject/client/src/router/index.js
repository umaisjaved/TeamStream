import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/authView.vue'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import ProfileView from '../views/ProfileView.vue'
import CreateRoomView from '../views/CreateRoomView.vue'
import JoinRoomView from '../views/JoinRoomView.vue'
import SearchGroupView from '../views/SearchGroupView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: AuthView },
    { path: '/rooms', name: 'rooms', component: HomeView },
    { path: '/chat', name: 'chat', component: ChatView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/create-room', name: 'create-room', component: CreateRoomView },
    { path: '/join-room', name: 'join-room', component: JoinRoomView },
    { path: '/search-groups', name: 'search-groups', component: SearchGroupView },
    { path: '/', redirect: '/login' }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicRoutes = ['login']
  if (!publicRoutes.includes(to.name) && !authStore.isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

export default router