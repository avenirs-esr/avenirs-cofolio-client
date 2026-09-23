import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredProgramFormApi, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredProgramRequestDTO, EAssociationContextType, invalidateGetDeclaredPrograms, useCreateDeclaredProgram } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { type AssociationSelections, useAssociationSelections } from '@/features/student/associations'
import { useDeclaredProgramFormValidators } from '@/features/student/personalCareer/composables/use-declared-program-form-validators/use-declared-program-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useAddDeclaredProgramForm (onProgramAdded?: () => void) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { hasFieldErrors } = useFormValidators()

  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const onCreateDeclaredProgramError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.AddDeclaredProgramDrawer.errors.createDeclaredProgram'),
      description: getErrorMessage(error)
    })
  }

  const validators = useDeclaredProgramFormValidators()

  const { mutate: mutateCreateDeclaredProgram, isPending } = useCreateDeclaredProgram()

  const { associateSelections, notifyAssociationErrors, isAssociating } = useAssociationSelections(EAssociationContextType.DECLARED_PROGRAM)

  function createDeclaredProgram (data: DeclaredProgramRequestDTO, associationSelections?: AssociationSelections) {
    mutateCreateDeclaredProgram({ data }, {
      onSuccess: async (createdProgram) => {
        await withTaskLoading(() => Promise.all([
          invalidateGetDeclaredPrograms(queryClient),
          associateSelections(createdProgram.id, associationSelections).then(notifyAssociationErrors)
        ]))
        onProgramAdded?.()
      },
      onError: onCreateDeclaredProgramError
    })
  }

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      organization: '',
      result: '',
      sourceOfInformation: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      valorized: false,
      associationSelections: {}
    } as DeclaredProgramFormData,
    validators: {
      onChange ({ value, formApi }: { value: DeclaredProgramFormData, formApi: DeclaredProgramFormApi }) {
        const isTouched = (field: keyof DeclaredProgramFormData) => formApi.getFieldMeta(field)?.isTouched ?? true
        const startDateError = validators.validateStartDate(value.startDate)
        return {
          fields: {
            title: isTouched('title') ? validators.validateTitle(value.title) : undefined,
            description: isTouched('description') ? validators.validateDescription(value.description) : undefined,
            organization: isTouched('organization') ? validators.validateOrganization(value.organization) : undefined,
            result: isTouched('result') ? validators.validateResult(value.result) : undefined,
            sourceOfInformation: isTouched('sourceOfInformation') ? validators.validateSourceOfInformation(value.sourceOfInformation) : undefined,
            startDate: isTouched('startDate') ? startDateError : undefined,
            endDate: isTouched('startDate') && !startDateError ? validators.validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing }) : undefined,
          }
        }
      },
      onBlur ({ formApi }: { formApi: DeclaredProgramFormApi }) {
        formApi.validate('change')
      }
    },
    onSubmit: ({ value }: { value: DeclaredProgramFormData }) => {
      createDeclaredProgram({
        title: value.title,
        description: value.description || undefined,
        organization: value.organization,
        result: value.result || undefined,
        sourceOfInformation: value.sourceOfInformation || undefined,
        startDate: value.startDate,
        endDate: value.isOngoing ? undefined : value.endDate || undefined
      } as DeclaredProgramRequestDTO, value.associationSelections)
    }
  })

  const hasDefinitionItemsError = hasFieldErrors(form, ['title', 'description', 'organization', 'result', 'sourceOfInformation', 'startDate', 'endDate'])

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: computed(() => isPending.value || isAssociating.value || isLoading.value),
    hasDefinitionItemsError
  }
}
