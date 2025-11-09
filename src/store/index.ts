import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export { useAmsStore } from '@/features/student/ams'
export { useSkillsStore } from '@/features/student/skills'
export { useTracesStore } from '@/features/student/traces'
export { useToasterStore } from '@/store/toaster/toaster'
export { useUserStore } from '@/store/user/user'

export default store
