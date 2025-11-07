import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export { useAmsStore, useSkillsStore, useTracesStore } from '@/features/student/stores'
export { useToasterStore } from '@/store/toaster/toaster'
export { useUserStore } from '@/store/user/user'

export default store
