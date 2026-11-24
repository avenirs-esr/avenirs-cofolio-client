import { defineStore } from 'pinia'

export const useLocalToolsStore = defineStore('localTools', () => {
  const localToolsCurrentPage = ref<number>(0)
  const regionalToolsCurrentPage = ref<number>(0)

  return {
    localToolsCurrentPage,
    regionalToolsCurrentPage,
  }
}, {
  persist: {
    pick: [
      'localToolsCurrentPage',
      'regionalToolsCurrentPage',
    ]
  }
})
