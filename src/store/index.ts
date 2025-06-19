import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export default store
export { useAmsPaginationSizePicker } from './pagination-size-picker/ams-pagination-size-picker'
export { useTracePaginationSizePicker } from './pagination-size-picker/trace-pagination-size-picker'
export { useTracePagination } from './pagination/trace-pagination'
export { useToasterStore } from './toaster/toaster'
