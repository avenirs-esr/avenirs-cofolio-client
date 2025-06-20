import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store
export { useAmsStore } from './ams/ams'
export { useToasterStore } from './toaster/toaster'
export { useTracesStore } from './traces/traces'
