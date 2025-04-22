import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faArrowRightArrowLeft,
    faMagnifyingGlass,
    faBell,
    faCircle,
    faHome,
    faChevronDown,
    faGraduationCap,
    faSeedling,
    faScrewdriverWrench
} from '@fortawesome/free-solid-svg-icons'
import {
    faMessage,
    faCircleUser
} from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(
    faArrowRightArrowLeft,
    faMagnifyingGlass,
    faBell,
    faCircle,
    faMessage,
    faCircleUser,
    faHome,
    faChevronDown,
    faGraduationCap,
    faSeedling,
    faScrewdriverWrench
)

// Import auth store and router
import { authStore } from './controller/services/auth'
import router from './controller/services/router'
// Import logging service
import logger, { LogLevel } from './controller/services/logging'

// Configure logger based on environment
if (import.meta.env.PROD) {
    logger.configure({
        minLevel: LogLevel.INFO,
        enableRemote: true,
        remoteUrl: import.meta.env.VITE_LOG_ENDPOINT,
        batchSize: 20
    });
} else {
    logger.configure({
        minLevel: LogLevel.DEBUG,
        enableRemote: false
    });
}

const app = createApp(App)

// Use Vuex store, router, and logger plugin
app.use(authStore)
app.use(router)
app.use(logger)
app.component('font-awesome-icon', FontAwesomeIcon)

// Log application startup
logger.info('Application starting', { version: import.meta.env.VITE_APP_VERSION });

app.mount('#app')

// Set authentication AFTER app is mounted
authStore.dispatch('login', { userId: 'user123', role: 'student' })
// Log successful login
logger.info('User authenticated', { userId: 'user123', role: 'student' });