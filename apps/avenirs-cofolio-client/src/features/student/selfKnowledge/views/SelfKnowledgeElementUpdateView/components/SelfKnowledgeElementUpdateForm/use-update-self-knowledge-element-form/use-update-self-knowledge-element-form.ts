import type { BaseApiException } from '@avenirs-esr/shared'
import type { MaybeRef } from '@vueuse/core'
import type { FileDTO, SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import { useApiErrors, useFormValidators } from '@avenirs-esr/shared'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { invalidateGetSelfKnowledgeElementDetails, useDeleteSelfKnowledgeAttachment, useUpdateSelfKnowledgeElement, useUploadSelfKnowledgeAttachment } from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { isFile } from '@/common/utils/file/file'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/selfKnowledge/config'
import { SelfKnowledgeElementType } from '@/features/student/selfKnowledge/types/forms.types'
import { useToasterStore } from '@/store'

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

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const onDeleteAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const { mutateAsync: uploadFile, isPending: isPendingUploadFile } = useUploadSelfKnowledgeAttachment({
    mutation: {
      onError: onUploadAttachmentError
    }
  })

  const { mutateAsync: deleteFile, isPending: isDeletingFile } = useDeleteSelfKnowledgeAttachment({
    mutation: {
      onError: onDeleteAttachmentError
    }
  })

  async function updateElementAttachments (selfKnowledgeElementId: string, formData: SelfKnowledgeCategoryElementFormData) {
    const wanted = formData.file ?? []
    const current = toValue(element).files ?? []

    const filesToUpload = wanted.filter((f): f is File => isFile(f))

    const keptIds = new Set(wanted.filter((f): f is FileDTO => !isFile(f)).map(f => f.id))

    const filesToDelete = current.filter(f => !keptIds.has(f.id))

    try {
      await Promise.all([
        ...filesToUpload.map(file =>
          uploadFile({ selfKnowledgeElementId, data: { file } })
        ),
        ...filesToDelete.map(fileDto =>
          deleteFile({ selfKnowledgeElementId, attachmentId: fileDto.id })
        )
      ])
    }
    catch {}
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
        await updateElementAttachments(toValue(element).id, formData)
        await withTaskLoading(() => invalidateGetSelfKnowledgeElementDetails(queryClient, toValue(element).id))
        onElementUpdated?.()
      },
      onError: onUpdateElementError
    })
  }

  const currentElement = toValue(element)

  const defaultValues: SelfKnowledgeCategoryElementFormData = {
    title: currentElement?.title ?? '',
    description: currentElement?.description ?? '',
    rating: currentElement?.rating ?? null,
    valorized: currentElement?.valorized ?? false,
    file: currentElement?.files ?? [],
    selfKnowledgeElementType: SelfKnowledgeElementType.FILE
  }

  const form = useForm({
    defaultValues,
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

  const isSubmitting = computed(() => isPending.value || isLoading.value || isPendingUploadFile.value || isDeletingFile.value)

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
