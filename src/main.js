import './assets/app.scss'
import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBicycle, faSearch, faLockOpen, faXmark} from '@fortawesome/free-solid-svg-icons'

library.add(faBicycle, faSearch, faLockOpen, faXmark)

createApp(App).mount('#app')
