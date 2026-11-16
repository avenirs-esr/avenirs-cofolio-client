import type { ComputedRef, Ref } from 'vue'

export interface SaveSource {
  /**
   * Some local changes are not persisted yet.
   */
  hasPendingChanges: Readonly<Ref<boolean>>
  /**
   * A request persisting the changes is in flight.
   */
  isSaving: Readonly<Ref<boolean>>
  /**
   * The pending changes can be saved right now (e.g. the form is valid).
   */
  canSave?: Readonly<Ref<boolean>>
  /**
   * Persists the pending changes right away.
   */
  saveNow: () => Promise<void>
}

export interface SaveState {
  /**
   * At least one source has changes that are not persisted yet.
   */
  hasPendingChanges: ComputedRef<boolean>
  /**
   * At least one source is persisting its changes.
   */
  isSaving: ComputedRef<boolean>
  /**
   * Some changes are pending or being persisted: any action relying on the persisted data has
   * to wait.
   */
  isBusy: ComputedRef<boolean>
  /**
   * At least one source can be saved right now.
   */
  canSave: ComputedRef<boolean>
  /**
   * Persists right away the pending changes of every source that can be saved.
   */
  saveNow: () => Promise<void>
}

/**
 * Combines the save state of several independent sources.
 *
 * @param sources The sources to combine
 * @returns The combined save state
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const titleForm = useTitleForm()
 * const contentEditor = useContentEditor()
 * const {
 *   hasPendingChanges,
 *   isSaving,
 *   isBusy,
 *   canSave,
 *   saveNow
 * } = useSaveState([
 *   titleForm,
 *   contentEditor,
 * ])
 *
 * onBeforeRouteLeave(() => !isBusy.value || confirmLeave())
 *
 * async function publish () {
 *   await saveNow()
 *   await until(isSaving).toBe(false)
 *
 *   if (hasPendingChanges.value) {
 *     return // still not persisted: invalid form or failed save
 *   }
 *
 *   await publishPage()
 * }
 * </script>
 *
 * <template>
 *   <button :disabled="!canSave" @click="saveNow">Save</button>
 *   <button @click="publish">Publish</button>
 * </template>
 * ```
 */
export function useSaveState (sources: SaveSource[]): SaveState {
  const hasPendingChanges = computed(() => sources.some(source => source.hasPendingChanges.value))
  const isSaving = computed(() => sources.some(source => source.isSaving.value))
  const isBusy = computed(() => hasPendingChanges.value || isSaving.value)

  function canSaveSource ({ canSave, hasPendingChanges }: SaveSource): boolean {
    return (canSave ?? hasPendingChanges).value
  }

  const canSave = computed(() => sources.some(canSaveSource))

  async function saveNow () {
    await Promise.all(sources.filter(canSaveSource).map(source => source.saveNow()))
  }

  return {
    hasPendingChanges,
    isSaving,
    isBusy,
    canSave,
    saveNow,
  }
}
