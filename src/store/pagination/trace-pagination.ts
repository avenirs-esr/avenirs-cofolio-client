import { defineStore } from 'pinia'

export const useTracePagination = defineStore('tracePagination', () => {
  const currentPage = ref(0)

  return {
    currentPage
  }
})
