import type { ActivityDraftUpdateRequest } from '@avenirs-esr/shared/api/avenir-esr'
import type { InjectionKey, Ref } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { SubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order'

export interface EditNationalActivityViewContext {
  /**
   * The form instance used for editing the activity draft, providing access to form state and methods.
   */
  form: EditActivityForm
  /**
   * A save request is in flight (activity form or sub-activities order).
   */
  isSaving: Readonly<Ref<boolean>>
  /**
   * Some changes are waiting for the autosave or being saved.
   */
  isBusy: Readonly<Ref<boolean>>
  /**
   * Some changes can be saved manually right now.
   */
  canSave: Readonly<Ref<boolean>>
  /**
   * Saves every pending change right away (full form submission and sub-activities order),
   * without waiting for the autosave.
   */
  saveNow: () => Promise<void>
  /**
   * Indicates whether the execution period (start and end dates) is enabled.
   */
  isExecutionPeriodEnabled: Ref<boolean>
  /**
   * Indicates whether the assessment is enabled, even if no option is selected yet.
   */
  isAssessmentEnabled: Ref<boolean>
  /**
   * Indicates whether the grade option of the assessment is enabled, even if the scale is not filled in yet.
   */
  isAssessmentGradeEnabled: Ref<boolean>
  /**
   * Sub-activities order, saved independently from the form (own endpoint and debounce).
   */
  subActivitiesOrder: SubActivitiesOrder
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
