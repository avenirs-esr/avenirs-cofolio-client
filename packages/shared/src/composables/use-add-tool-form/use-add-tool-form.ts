import type { CreateLocalToolRequest, CreateNationalToolRequest, FileDTO, ToolDTO } from '#shared/api/avenir-esr'
import type { BaseApiException } from '#shared/exceptions'
import {
  createLocalTool,
  createNationalTool,
  invalidateGetLocalTools,
  invalidateGetNationalTools,
  uploadLocalToolBanner,
  uploadNationalToolBanner,
} from '#shared/api/avenir-esr'
import { useApiErrors } from '#shared/composables/use-api-errors/use-api-errors'
import { useToolFormValidators } from '#shared/composables/use-tool-form-validators/use-tool-form-validators'
import { useToasterStore } from '#shared/stores/toaster/toaster'
import { useForm } from '@tanstack/vue-form'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface ToolFormData {
  name: string
  banner: File | null
  description: string
  url: string
}

export interface UseAddToolFormOptions {
  isNational: boolean
  onToolAdded?: () => void
}

interface UploadToolBannerVariables {
  toolId: string
  file: File
}

export function useAddToolForm ({ isNational, onToolAdded }: UseAddToolFormOptions) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage, addWarningMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const validators = useToolFormValidators()

  const i18nKey = 'global.composables.useAddToolForm'

  const { mutateAsync: createTool } = useMutation<ToolDTO, BaseApiException, CreateNationalToolRequest | CreateLocalToolRequest>({
    mutationFn: data => isNational || !('institutionId' in data)
      ? createNationalTool(data)
      : createLocalTool(data),
    onError: error => addErrorMessage({
      title: t(`${i18nKey}.errors.create`),
      description: getErrorMessage(error),
    }),
  })

  const { mutateAsync: uploadToolBanner } = useMutation<FileDTO, BaseApiException, UploadToolBannerVariables>({
    mutationFn: ({ toolId, file }) => isNational
      ? uploadNationalToolBanner(toolId, { file })
      : uploadLocalToolBanner(toolId, { file }),
  })

  async function addTool ({ name, banner, description, url }: ToolFormData) {
    const tool = await createTool({
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
    }).catch(() => undefined)

    if (!tool) {
      return
    }

    const isBannerUploaded = !banner || !tool.id || await uploadToolBanner({ toolId: tool.id, file: banner })
      .then(() => true)
      .catch(() => false)

    await (isNational ? invalidateGetNationalTools(queryClient) : invalidateGetLocalTools(queryClient))

    if (isBannerUploaded) {
      addSuccessMessage({
        timeout: 2000,
        description: t(`${i18nKey}.success`),
      })
    }
    else {
      addWarningMessage({
        title: t(`${i18nKey}.partialSuccess.title`),
        description: t(`${i18nKey}.partialSuccess.description`),
      })
    }

    onToolAdded?.()
  }

  const defaultValues: ToolFormData = {
    name: '',
    banner: null,
    description: '',
    url: '',
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: ({ value, formApi }) => {
        const isTouched = (field: keyof ToolFormData) => formApi.getFieldMeta(field)?.isTouched ?? true

        return {
          fields: {
            name: isTouched('name') ? validators.validateName(value.name) : undefined,
            description: isTouched('description') ? validators.validateDescription(value.description) : undefined,
            url: isTouched('url') ? validators.validateUrl(value.url) : undefined,
          }
        }
      },
      onBlur: ({ formApi }) => {
        formApi.validate('change')
      },
    },
    onSubmit: ({ value }) => addTool(value),
  })

  const isFormValid = form.useStore(state => state.isValid && !state.isValidating && state.isDirty)
  const isSubmitting = form.useStore(state => state.isSubmitting)

  return {
    form,
    isFormValid,
    isSubmitting,
  }
}

export type AddToolForm = ReturnType<typeof useAddToolForm>['form']
