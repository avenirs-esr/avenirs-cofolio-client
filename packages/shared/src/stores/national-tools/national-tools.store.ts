import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNationalToolsStore = defineStore('nationalTools', () => {
  const nationalToolsCurrentPage = ref<number>(0)

  return {
    nationalToolsCurrentPage,
  }
}, {
  persist: {
    pick: [
      'nationalToolsCurrentPage',
    ]
  }
})
