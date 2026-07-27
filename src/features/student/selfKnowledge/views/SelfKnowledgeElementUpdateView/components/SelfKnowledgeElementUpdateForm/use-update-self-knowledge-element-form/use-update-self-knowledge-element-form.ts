import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { invalidateGetSelfKnowledgeElementDetails, type SelfKnowledgeElementDetailsDTO, useUpdateSelfKnowledgeElement } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/selfKnowledge/config'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateSelfKnowledgeElementForm (
  element: MaybeRef<SelfKnowledgeElementDetailsDTO>,
  onElementUpdated?: () => void
) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { validateRequired, validateMaxLength } = useFormValidators()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onUpdateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.views.SelfKnowledgeElementUpdateView.updateForm.errors.updateElement'),
      description: getErrorMessage(error)
    })
  }

  const { mutate: mutateUpdateSelfKnowledgeElement, isPending } = useUpdateSelfKnowledgeElement()

  function updateSelfKnowledgeElement (formData: SelfKnowledgeCategoryElementFormData) {
    mutateUpdateSelfKnowledgeElement({
      selfKnowledgeElementId: toValue(element).id,
      data: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined,
        valorized: formData.valorized
      }
    }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetSelfKnowledgeElementDetails(queryClient, toValue(element).id))
        onElementUpdated?.()
      },
      onError: onUpdateElementError
    })
  }

  const currentElement = toValue(element)

  const form = useForm({
    defaultValues: {
      title: currentElement?.title ?? '',
      description: currentElement?.description ?? '',
      rating: currentElement?.rating ?? null,
      valorized: currentElement?.valorized ?? false,
    },
    validators: {
      onChange: ({ value }: { value: SelfKnowledgeCategoryElementFormData }) => {
        return {
          fields: {
            title: validateRequired(value.title) || validateMaxLength(value.title, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH),
            description: validateRequired(value.description) || validateMaxLength(value.description, SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH)
          }
        }
      },
      onSubmit ({ value }: { value: SelfKnowledgeCategoryElementFormData }) {
        return {
          fields: {
            title: validateRequired(value.title) || validateMaxLength(value.title, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH),
            description: validateRequired(value.description) || validateMaxLength(value.description, SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH)
          }
        }
      }
    },
    onSubmit: ({ value }: { value: SelfKnowledgeCategoryElementFormData }) => {
      updateSelfKnowledgeElement(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isSubmitting = computed(() => isPending.value || isLoading.value)

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
