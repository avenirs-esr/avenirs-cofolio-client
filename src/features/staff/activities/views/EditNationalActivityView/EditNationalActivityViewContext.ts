import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { InjectionKey, Ref } from 'vue'

export interface EditNationalActivityViewContext {
  /**
   * The form instance used for editing the activity draft, providing access to form state and methods.
   */
  form: EditActivityForm
  /**
   * Indicates whether the activity draft is currently being updated, allowing the UI to reflect loading states.
   */
  isUpdating: Ref<boolean>
  /**
   * Indicates whether the execution period (start and end dates) is enabled.
   */
  isExecutionPeriodEnabled: Ref<boolean>
  /**
   * Updates the activity without submitting the form (supports partial updates).
   * A full update requires calling form.handleSubmit().
   */
  save: (data?: ActivityDraftUpdateRequest) => void
  /**
   * Queues a partial autosave. Multiple concurrent field updates are merged into a single API call.
   */
  queueAutoSave: (data?: ActivityDraftUpdateRequest) => void
}

export const editNationalActivityViewContextKey: InjectionKey<EditNationalActivityViewContext> = Symbol('editNationalActivityViewContext')

export function provideEditNationalActivityViewContext (context: EditNationalActivityViewContext): void {
  provide(editNationalActivityViewContextKey, context)
}

export function useEditNationalActivityViewContext (): EditNationalActivityViewContext {
  const context = inject(editNationalActivityViewContextKey)

  if (!context) {
    throw new Error('useEditNationalActivityViewContext must be called within a component that provides the editNationalActivityViewContext')
  }

  return context
}
