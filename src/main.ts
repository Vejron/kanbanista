import './assets/main.css'
import 'github-markdown-css/github-markdown-dark.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
