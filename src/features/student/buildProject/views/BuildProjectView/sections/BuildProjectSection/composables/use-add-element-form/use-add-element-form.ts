import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/buildProject/config'
import { useForm } from '@tanstack/vue-form'

export interface AddElementFormData {
  title: string
  description: string
  rating: number
}

export function useAddElementForm (onConfirm: (data: AddElementFormData) => void) {
  const { validateRequired, validateMaxLength } = useFormValidators()

  const initialData: AddElementFormData = {
    title: '',
    description: '',
    rating: 0
  }
  const form = useForm({
    defaultValues: initialData,
    validators: {
      onChange ({ value }: { value: AddElementFormData }) {
        return {
          fields: {
            title: validateRequired(value.title) ?? validateMaxLength(value.title, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH),
            description: validateRequired(value.description) ?? validateMaxLength(value.description, SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH),
          }
        }
      },
      onSubmit ({ value }: { value: AddElementFormData }) {
        return {
          fields: {
            title: validateRequired(value.title) ?? validateMaxLength(value.title, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH),
            description: validateRequired(value.description) ?? validateMaxLength(value.description, SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH),
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
