import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export { useAmsStore } from './ams/ams'
export { useSkillsStore } from './skills/skills'
export { useToasterStore } from './toaster/toaster'
export { useTracesStore } from './traces/traces'

export default store
