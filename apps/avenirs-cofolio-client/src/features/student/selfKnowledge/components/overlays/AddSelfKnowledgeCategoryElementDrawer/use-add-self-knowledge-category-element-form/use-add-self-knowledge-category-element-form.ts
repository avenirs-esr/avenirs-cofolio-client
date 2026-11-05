import type { BaseApiException } from '@avenirs-esr/shared'
import type { MaybeRef } from '@vueuse/core'
import type { ESelfKnowledgeCategory, FileDTO } from '@/api/avenir-esr'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import { useApiErrors, useFormValidators } from '@avenirs-esr/shared'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { invalidateGetSelfKnowledgeElements, useCreateSelfKnowledgeElement, useDeleteSelfKnowledgeAttachment, useUploadSelfKnowledgeAttachment } from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/buildProject/config'
import { SelfKnowledgeElementType } from '@/features/student/selfKnowledge/types/forms.types'
import { useToasterStore } from '@/store'

export function useAddSelfKnowledgeCategoryElementForm (
  selfKnowledgeCategory: MaybeRef<ESelfKnowledgeCategory>,
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
      selfKnowledgeCategory: toValue(selfKnowledgeCategory),
      data: {
        title: formData.title,
        description: formData.description,
        rating: formData.rating && formData.rating > 0 ? formData.rating : undefined,
        valorized: formData.valorized
      }
    }, {
      onSuccess: async (result) => {
        const selfKnowledgeElementId = result.id

        if (!selfKnowledgeElementId) {
          addErrorMessage({ title: t('student.selfKnowledge.overlays.AddSelfKnowledgeCategoryElementDrawer.errors.createElement'), description: t('global.errors.generic') })
          return
        }

        await finalizeSelfKnowledgeElementCreation(
          selfKnowledgeElementId,
          formData
        )

        await withTaskLoading(() =>
          invalidateGetSelfKnowledgeElements(queryClient)
        )

        onElementCreated?.()
      },
      onError: onCreateElementError
    })
  }

  function onUploadAttachmentError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.error.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  function onDeleteAttachmentError (error: BaseApiException) {
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

  const defaultValues: SelfKnowledgeCategoryElementFormData = {
    title: '',
    description: '',
    rating: null,
    valorized: false,
    selfKnowledgeElementType: SelfKnowledgeElementType.FILE,
    file: []
  }

  async function finalizeSelfKnowledgeElementCreation (selfKnowledgeElementId: string, selfKnowledgeElementData: SelfKnowledgeCategoryElementFormData) {
    const files = selfKnowledgeElementData.file ?? []

    const filesToUpload = files.filter(
      (file): file is File => file instanceof File
    )

    const filesToDelete = files.filter(
      (file): file is FileDTO => !(file instanceof File)
    )
    try {
      await Promise.all([
        ...filesToUpload.map(file =>
          uploadFile({
            selfKnowledgeElementId,
            data: { file }
          })
        ),
        ...filesToDelete.map(fileDto =>
          deleteFile({
            selfKnowledgeElementId,
            attachmentId: fileDto.id
          })
        )
      ])
    }
    catch {}
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
    return isPending.value || isLoading.value || isPendingUploadFile.value || isDeletingFile.value
  })

  const hasElementDetailsErrors = hasFieldErrors(form, ['title', 'description'])

  return {
    form,
    isFormValid,
    isSubmitting,
    hasElementDetailsErrors
  }
}
