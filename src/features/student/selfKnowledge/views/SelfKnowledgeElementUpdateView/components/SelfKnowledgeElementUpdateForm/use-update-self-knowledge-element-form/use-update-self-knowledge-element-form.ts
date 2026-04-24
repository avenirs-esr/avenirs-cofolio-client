import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { invalidateGetSelfKnowledgeElementDetails, type SelfKnowledgeElementDetailsDTO, useUpdateSelfKnowledgeElement } from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
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
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const onUpdateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.views.SelfKnowledgeElementUpdateView.updateForm.errors.updateElement'),
      description: error.message
    })
  }

  const { mutate: mutateUpdateSelfKnowledgeElement, isPending } = useUpdateSelfKnowledgeElement()

  function updateSelfKnowledgeElement (formData: SelfKnowledgeCategoryElementFormData) {
    mutateUpdateSelfKnowledgeElement({
      selfKnowledgeElementId: toValue(element).id,
      data: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined
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
