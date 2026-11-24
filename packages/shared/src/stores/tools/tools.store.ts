import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToolsStore = defineStore('tools', () => {
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
