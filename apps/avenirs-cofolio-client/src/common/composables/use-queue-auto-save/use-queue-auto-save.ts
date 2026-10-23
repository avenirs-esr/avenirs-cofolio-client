import { debounce } from 'lodash-es'

/**
 * A composable that provides a queue for autosaving data with a debounce mechanism.
 * @param save Function to save the data
 * @param debounceDelay Debounce delay in milliseconds
 * @returns An object with queueAutoSave, flushAutoSave, cancelAutoSave, and pendingAutoSaveData properties
 */
export function useQueueAutoSave<T> (
  save: (data?: T) => Promise<void>,
  debounceDelay: number
) {
  const pendingAutoSaveData = ref<Partial<T>>({})

  const flushAutoSave = debounce(() => {
    const data = { ...pendingAutoSaveData.value }
    pendingAutoSaveData.value = {}

    if (Object.keys(data).length > 0) {
      void save(data as T)
    }
    else {
      void save()
    }
  }, debounceDelay)

  function queueAutoSave (data?: Partial<T>) {
    if (data) {
      pendingAutoSaveData.value = {
        ...pendingAutoSaveData.value,
        ...data
      }
    }

    flushAutoSave()
  }

  return {
    queueAutoSave,
    flushAutoSave,
    cancelAutoSave: flushAutoSave.cancel,
    pendingAutoSaveData,
  }
}
