import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Global Styles
import './assets/styles/variables.css'
import './assets/styles/theme.css'
import './assets/styles/components.css'
import './assets/styles/animations.css'
import './assets/styles/utilities.css'
import './assets/styles/scrollbar.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')