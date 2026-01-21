import type { Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export interface UseUnsavedChangesGuardOptions {
  /**
   * Indicates whether the page contains unsaved changes.
   * Must be a Ref (ref/computed) so it reflects the actual form state.
   */
  isDirty: Ref<boolean>

  /**
   * Opens the confirmation modal.
   * This function is automatically called when navigation is attempted
   * and `isDirty.value === true`.
   */
  openModal: () => void

  /**
   * Closes the confirmation modal.
   * This function is automatically called after `confirm()` or `cancel()`.
   */
  closeModal: () => void

  /**
   * Enables protection on refresh / tab close.
   * @default true
   */
  withBeforeUnload?: boolean
}

/**
 * Prevents navigation when unsaved changes exist.
 *
 * Instantiate it in **each routed view** that contains a form (or editing)
 * to protect the user from losing data.
 *
 * Integration example (with ConfirmationModal):
 *
 * ```ts
 * const { showModal, displayModal, hideModal } = useModal()
 * const isDirty = computed(() => form.meta.value.dirty)
 *
 * const {
 *   canLeave,
 *   confirm,
 *   cancel
 * } = useUnsavedChangesGuard({
 *   isDirty,
 *   openModal: displayModal,
 *   closeModal: hideModal
 * })
 * ```
 *
 * ```vue
 * <ConfirmationModal
 *   :show="showModal"
 *   @close="cancel"
 *   @confirm="confirm"
 * />
 * ```
 */
export function useUnsavedChangesGuard ({
  isDirty,
  openModal,
  closeModal,
  withBeforeUnload = true
}: UseUnsavedChangesGuardOptions) {
  let resolver: ((value: boolean) => void) | null = null

  function requestConfirmation () {
    openModal()

    return new Promise<boolean>((resolve) => {
      resolver = resolve
    })
  }

  function cleanup () {
    resolver = null
    closeModal()
  }

  function confirm () {
    resolver?.(true)
    cleanup()
  }

  function cancel () {
    resolver?.(false)
    cleanup()
  }

  async function canLeave () {
    if (!isDirty.value) {
      return true
    }

    return requestConfirmation()
  }

  onBeforeRouteLeave(() => canLeave())

  if (withBeforeUnload) {
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

  return {
    canLeave,
    confirm,
    cancel
  }
}
