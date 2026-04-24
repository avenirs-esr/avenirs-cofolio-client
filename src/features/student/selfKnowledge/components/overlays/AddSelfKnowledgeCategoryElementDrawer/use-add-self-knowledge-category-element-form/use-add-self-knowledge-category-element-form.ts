import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { invalidateGetSelfKnowledgeElements, useCreateSelfKnowledgeElement } from '@/api/avenir-esr'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAddSelfKnowledgeCategoryElementForm (
  selfKnowledgeCategoryId: MaybeRef<string>,
  onElementCreated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()

  const onCreateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.errors.createElement'),
      description: error.message
    })
  }

  const { mutate: mutateCreateSelfKnowledgeElement, isPending } = useCreateSelfKnowledgeElement()

  function createSelfKnowledgeElement (formData: SelfKnowledgeCategoryElementFormData) {
    mutateCreateSelfKnowledgeElement({
      selfKnowledgeCategoryId: toValue(selfKnowledgeCategoryId),
      data: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined
      }
    }, {
      onSuccess: async () => {
        await invalidateGetSelfKnowledgeElements(queryClient, toValue(selfKnowledgeCategoryId))
        onElementCreated?.()
      },
      onError: onCreateElementError
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
      createSelfKnowledgeElement(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isSubmitting = computed(() => {
    return isPending.value
  })

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
