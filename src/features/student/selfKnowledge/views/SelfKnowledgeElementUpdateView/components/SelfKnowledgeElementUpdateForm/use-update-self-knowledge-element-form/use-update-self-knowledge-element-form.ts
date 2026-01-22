import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { useUpdateSelfKnowledgeElementMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateSelfKnowledgeElementForm (
  element: MaybeRef<SelfKnowledgeElementDetailsDTO>,
  onElementUpdated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onUpdateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.views.SelfKnowledgeElementUpdateView.updateForm.errors.updateElement'),
      description: error.message
    })
  }

  const updateElementMutation = useUpdateSelfKnowledgeElementMutation({
    onError: onUpdateElementError
  })

  const currentElement = toValue(element)

  function updateElement (formData: SelfKnowledgeCategoryElementFormData) {
    const elementValue = toValue(element)

    updateElementMutation.mutate(
      {
        selfKnowledgeElementId: elementValue.id,
        element: {
          title: formData.title,
          description: formData.description,
          rating: formData.rating && formData.rating > 0 ? formData.rating : undefined
        }
      },
      {
        onSuccess: () => onElementUpdated?.()
      }
    )
  }

  const form = useForm({
    defaultValues: {
      title: currentElement?.title ?? '',
      description: currentElement?.description ?? '',
      rating: currentElement?.rating ?? null
    },
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
      updateElement(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isSubmitting = computed(() => updateElementMutation.isPending.value)

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
