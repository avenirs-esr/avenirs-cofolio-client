import type { BaseApiException } from '@/common/exceptions'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import type { MaybeRef } from '@vueuse/core'
import { invalidateGetSelfKnowledgeElements, useCreateSelfKnowledgeElement } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/buildProject/config'
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
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const { validateMaxLength, hasFieldErrors } = useFormValidators()

  const onCreateElementError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.errors.createElement'),
      description: getErrorMessage(error)
    })
  }

  const { mutate: mutateCreateSelfKnowledgeElement, isPending } = useCreateSelfKnowledgeElement()

  function createSelfKnowledgeElement (formData: SelfKnowledgeCategoryElementFormData) {
    mutateCreateSelfKnowledgeElement({
      selfKnowledgeCategoryId: toValue(selfKnowledgeCategoryId),
      data: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined,
        valorized: formData.valorized
      }
    }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetSelfKnowledgeElements(queryClient, toValue(selfKnowledgeCategoryId)))
        onElementCreated?.()
      },
      onError: onCreateElementError
    })
  }

  const defaultValues: SelfKnowledgeCategoryElementFormData = {
    title: '',
    description: '',
    rating: null,
    valorized: false
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange ({ value }: { value: SelfKnowledgeCategoryElementFormData }) {
        return {
          fields: {
            title: validateMaxLength(value.title, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH),
            description: validateMaxLength(value.description, SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH)
          }
        }
      },
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
    return isPending.value || isLoading.value
  })

  const hasElementDetailsErrors = hasFieldErrors(form, ['title', 'description'])

  return {
    form,
    isFormValid,
    isSubmitting,
    hasElementDetailsErrors
  }
}
