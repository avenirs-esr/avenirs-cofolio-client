import type { Ref } from 'vue'

export interface UseUnsavedChangesGuardOptions {
  isDirty: Ref<boolean>
  confirmLeave: () => boolean | Promise<boolean>
  withBeforeUnload?: boolean
}

export function useUnsavedChangesGuard ({
  isDirty,
  confirmLeave,
  withBeforeUnload = true
}: UseUnsavedChangesGuardOptions) {
  const canLeave = async () => {
    if (!isDirty.value) {
      return true
    }

    try {
      return confirmLeave()
    }
    catch {
      return false
    }
  }

  onBeforeRouteLeave(() => canLeave())

  if (!withBeforeUnload) {
    return
  }

  const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (!isDirty.value) {
      return
    }
    e.preventDefault()
    e.returnValue = ''
  }

  onMounted(() => {
    window.addEventListener('beforeunload', beforeUnloadHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
  })
}
