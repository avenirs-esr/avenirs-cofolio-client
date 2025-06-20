import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store
export { useAmsPageSizePicker } from './page-size-picker/ams-page-size-picker'
export { useTracePageSizePicker } from './page-size-picker/trace-page-size-picker'
export { useTracePagination } from './pagination/trace-pagination'
export { useToasterStore } from './toaster/toaster'
