/**
 * Composable for managing task loading state.
 * @returns An object containing the loading state and a function to wrap tasks with loading state management.
 */
export function useTaskLoading () {
  const pendingCount = ref(0)
  const isLoading = computed(() => pendingCount.value > 0)

  async function withTaskLoading<T> (task: () => Promise<T>): Promise<T> {
    pendingCount.value++
    try {
      return await task()
    }
    finally {
      pendingCount.value--
    }
  }

  return {
    isLoading,
    withTaskLoading
  }
}
