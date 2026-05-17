import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { InjectionKey } from 'vue'

export interface EditNationalActivityViewContext {
  /**
   * The form instance used for editing the activity draft, providing access to form state and methods.
   */
  form: EditActivityForm
  /**
   * Saves the activity draft with the provided data. If no data is provided, it submits the form.
   */
  save: (data?: ActivityDraftUpdateRequest) => void
  /**
   * Cancels the editing of the activity draft, discarding any unsaved changes.
   */
  cancel: () => void
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
