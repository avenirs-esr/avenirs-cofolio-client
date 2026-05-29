import type { BaseApiException } from '@/common/exceptions'
import type { Association } from '@/features/student/global/types/associations.types'
import type { ComputedRef } from 'vue'
import { ELanguage, type TraceAssociationsDTO } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTraceFormValidators } from '@/features/student/traces/composables/use-trace-form-validators/use-trace-form-validators'
import {
  useAssociateTraceWithActivitiesMutation,
  useAssociateTraceWithDeclaredSkillsMutation,
  useCreateTraceMutation,
  useUploadAttachmentMutation
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { EAssociationTypeKey, type TraceFormData, TraceType } from '@/features/student/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/student/traces/utils/trace.types-guard'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

function getIdsForType (associationSelections: Record<string, Association[]>, typeKey: string): string[] {
  return (associationSelections[typeKey] ?? []).map(item => item.id)
}
export function useCreateTraceForm (onTraceCreated?: () => void) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { buildValidators } = useTraceFormValidators()
  const { hasFieldErrors } = useFormValidators()

  function onCreateTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
      description: getErrorMessage(error)
    })
  }

  const createTraceMutation = useCreateTraceMutation({ onError: onCreateTraceError })

  function onUploadAttachmentError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({ onError: onUploadAttachmentError })

  function onAssociationError () {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.association.title'),
      description: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.association.description')
    })
  }

  const { mutateAsync: associateWithActivities, isPending: isPendingAssociateWithActivities } = useAssociateTraceWithActivitiesMutation()
  const { mutateAsync: associateWithDeclaredSkills, isPending: isPendingAssociateWithDeclaredSkills } = useAssociateTraceWithDeclaredSkillsMutation()

  const isFileUploading = ref(false)

  function associateElements (traceId: string, associationSelections: Record<string, Association[]>) {
    const pendingAssociations = []

    const activityIds = getIdsForType(associationSelections, EAssociationTypeKey.ACTIVITIES)
    if (activityIds.length > 0) {
      pendingAssociations.push(associateWithActivities({
        traceId,
        associationsCreationRequest: { idsToAssociate: activityIds }
      }))
    }

    const skillIds = getIdsForType(associationSelections, EAssociationTypeKey.DECLARED_SKILLS)
    if (skillIds.length > 0) {
      pendingAssociations.push(associateWithDeclaredSkills({
        traceId,
        associationsCreationRequest: { idsToAssociate: skillIds }
      }))
    }

    return pendingAssociations
  }

  async function finalizeTraceCreation (traceId: string, traceFormData: TraceFormData) {
    if (isTraceFileType(traceFormData) && traceFormData.file) {
      await uploadAttachmentMutation.mutateAsync({
        traceId,
        file: traceFormData.file
      })
    }

    onTraceCreated?.()

    const selections = traceFormData.associationSelections ?? {}
    const $associations = associateElements(traceId, selections)

    await Promise.allSettled($associations).then((data: PromiseSettledResult<TraceAssociationsDTO>[]) => {
      const rejected = data.filter(result => result.status === 'rejected')

      if (rejected.length > 0) {
        onAssociationError()
      }
    })
  }

  function createTrace (traceFormData: TraceFormData) {
    createTraceMutation.mutate({
      title: traceFormData.traceName,
      personalNote: traceFormData.personalNote || undefined,
      isGroup: traceFormData.isGroup,
      iaJustification: traceFormData.useIA ? traceFormData.iaJustification : undefined,
      language: ELanguage.FRENCH,
      link: isTraceLinkType(traceFormData) ? traceFormData.link : undefined,
    }, {
      onSuccess: async (traceResult) => {
        await finalizeTraceCreation(traceResult.traceId, traceFormData)
      }
    })
  }

  const form = useForm({
    defaultValues: {
      file: null,
      traceType: TraceType.FILE,
      traceName: '',
      personalNote: '',
      isAuthentic: false,
      isGroup: false,
      useIA: false,
      iaJustification: '',
      associationSelections: {}
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      },
      onChange ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      }
    },
    onSubmit: ({ value }: { value: TraceFormData }) => {
      createTrace(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  const hasDefinitionItemsError = hasFieldErrors(form, ['traceName', 'personalNote', 'traceType', 'file', 'link'])
  const hasDeclarationItemsError = hasFieldErrors(form, ['isAuthentic', 'isGroup', 'useIA'])

  const isSubmitting: ComputedRef<boolean> = computed(() => {
    return createTraceMutation.isPending.value
      || uploadAttachmentMutation.isPending.value
      || isPendingAssociateWithActivities.value
      || isPendingAssociateWithDeclaredSkills.value
      || isFileUploading.value
  })

  return {
    form,
    isFormValid,
    isSubmitting,
    hasDefinitionItemsError,
    hasDeclarationItemsError
  }
}
