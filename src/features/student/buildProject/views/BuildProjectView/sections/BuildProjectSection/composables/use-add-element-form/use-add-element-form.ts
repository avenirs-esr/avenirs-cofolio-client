import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export interface AddElementFormData {
  title: string
  description: string
  rating: number
}

export function useAddElementForm (onConfirm: (data: AddElementFormData) => void) {
  const { t } = useI18n()

  const initialData: AddElementFormData = {
    title: '',
    description: '',
    rating: 0
  }
  const form = useForm({
    defaultValues: initialData,
    validators: {
      onSubmit ({ value }: { value: AddElementFormData }) {
        return {
          fields: {
            title: !value.title.trim() ? t('global.error.form.requiredField') : undefined,
            description: !value.description.trim() ? t('global.error.form.requiredField') : undefined,
          }
        }
      },
    },
    onSubmit: async ({ value }: { value: AddElementFormData }) => {
      onConfirm(value)
    }
  })

  const isModified = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
  })

  const isValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid
  })

  function resetForm () {
    form.reset(initialData)
  }

  return {
    form,
    isModified,
    isValid,
    resetForm
  }
}
