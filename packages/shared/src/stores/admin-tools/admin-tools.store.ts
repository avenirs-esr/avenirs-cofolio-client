import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminToolsStore = defineStore('adminTools', () => {
  const nationalToolsCurrentPage = ref<number>(0)
  const regionalToolsCurrentPage = ref<number>(0)
  const localToolsCurrentPage = ref<number>(0)

  return {
    nationalToolsCurrentPage,
    regionalToolsCurrentPage,
    localToolsCurrentPage,
  }
}, {
  persist: {
    pick: [
      'nationalToolsCurrentPage',
      'regionalToolsCurrentPage',
      'localToolsCurrentPage',
    ]
  }
})
