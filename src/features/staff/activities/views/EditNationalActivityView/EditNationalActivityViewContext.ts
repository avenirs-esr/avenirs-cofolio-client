import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { InjectionKey } from 'vue'

export interface EditNationalActivityViewContext {
  form: EditActivityForm
  save: () => void
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
