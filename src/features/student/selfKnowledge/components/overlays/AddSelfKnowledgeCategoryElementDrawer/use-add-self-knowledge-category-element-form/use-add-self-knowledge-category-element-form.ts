import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { useAddSelfKnowledgeCategoryElementMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAddSelfKnowledgeCategoryElementForm (
  selfKnowledgeCategoryId: MaybeRef<string>,
  onElementCreated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onCreateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.errors.createElement'),
      description: error.message
    })
  }

  const createElementMutation = useAddSelfKnowledgeCategoryElementMutation({ onError: onCreateElementError })

  function createElement (formData: SelfKnowledgeCategoryElementFormData) {
    createElementMutation.mutate({
      selfKnowledgeCategoryId: toValue(selfKnowledgeCategoryId),
      element: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined
      }
    }, {
      onSuccess: () => onElementCreated?.()
    })
  }

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      rating: null
    } as SelfKnowledgeCategoryElementFormData,
    validators: {
      onSubmit ({ value }: { value: SelfKnowledgeCategoryElementFormData }) {
        return {
          fields: {
            title: !value.title.trim() ? t('global.error.form.requiredField') : undefined,
            description: !value.description.trim() ? t('global.error.form.requiredField') : undefined
          }
        }
      }
    },
    onSubmit: ({ value }: { value: SelfKnowledgeCategoryElementFormData }) => {
      createElement(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isSubmitting = computed(() => {
    return createElementMutation.isPending.value
  })

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
