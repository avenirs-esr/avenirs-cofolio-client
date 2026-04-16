import type { BaseApiException } from '@/common/exceptions'
import type { IdTitle } from '@/types'
import type { ComputedRef } from 'vue'
import { ELanguage } from '@/api/avenir-esr'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTraceFileValidation } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
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

function getIdsForType (associationSelections: Record<string, IdTitle[]>, typeKey: string): string[] {
  return (associationSelections[typeKey] ?? []).map(item => item.id)
}
export function useCreateTraceForm (onTraceCreated?: () => void) {
  const { t } = useI18n()

  const { addErrorMessage } = useToasterStore()
  const { validateLink } = useFormValidators()

  function onCreateTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
      description: error.message
    })
  }

  const createTraceMutation = useCreateTraceMutation({ onError: onCreateTraceError })

  function onUploadAttachmentError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.fileUpload'),
      description: error.message
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({ onError: onUploadAttachmentError })

  function onAssociationError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.association'),
      description: error.message
    })
  }

  function makeAssociationPromise<T> (
    mutate: (variables: T, options: { onSuccess: () => void, onError: (error: BaseApiException) => void }) => void,
    variables: T
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      mutate(variables, {
        onSuccess: () => resolve(),
        onError: (error) => {
          onAssociationError(error)
          reject(error)
        }
      })
    })
  }

  const { mutate: associateWithActivities, isPending: isPendingAssociateWithActivities } = useAssociateTraceWithActivitiesMutation({ onError: onAssociationError })
  const { mutate: associateWithDeclaredSkills, isPending: isPendingAssociateWithDeclaredSkills } = useAssociateTraceWithDeclaredSkillsMutation({ onError: onAssociationError })

  const isFileUploading = ref(false)

  const { validateFile } = useTraceFileValidation(true)

  function associateElements (traceId: string, associationSelections: Record<string, IdTitle[]>) {
    const pendingAssociations: Promise<void>[] = []

    const activityIds = getIdsForType(associationSelections, EAssociationTypeKey.ACTIVITIES)
    if (activityIds.length > 0) {
      pendingAssociations.push(makeAssociationPromise(associateWithActivities, {
        traceId,
        associationsCreationRequest: { idsToAssociate: activityIds }
      }))
    }

    const skillIds = getIdsForType(associationSelections, EAssociationTypeKey.DECLARED_SKILLS)
    if (skillIds.length > 0) {
      pendingAssociations.push(makeAssociationPromise(associateWithDeclaredSkills, {
        traceId,
        associationsCreationRequest: { idsToAssociate: skillIds }
      }))
    }

    return pendingAssociations
  }

  function finalizeTraceCreation (traceId: string, traceFormData: TraceFormData) {
    const selections = traceFormData.associationSelections ?? {}
    const pendingOperations: Promise<void>[] = associateElements(traceId, selections)

    if (isTraceFileType(traceFormData) && traceFormData.file) {
      pendingOperations.push(
        makeAssociationPromise(uploadAttachmentMutation.mutate, {
          traceId,
          file: traceFormData.file
        })
      )
    }

    Promise.allSettled(pendingOperations).then(() => {
      onTraceCreated?.()
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
      onSuccess: (traceResult) => {
        finalizeTraceCreation(traceResult.traceId, traceFormData)
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
        return {
          fields: {
            file: isTraceFileType(value) ? validateFile(value.file) : undefined,
            link: isTraceLinkType(value) ? validateLink(value.link, true) : undefined,
            traceName: !value.traceName.trim() ? t('global.error.form.requiredField') : undefined,
            isAuthentic: !value.isAuthentic ? t('student.traces.interactions.toggles.TraceAuthenticDeclarationToggle.requiredMessage') : undefined,
            iaJustification: value.useIA && (!value.iaJustification || !value.iaJustification.trim()) ? t('global.error.form.requiredField') : undefined,
          }
        }
      },
      onChange ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: isTraceFileType(value) ? validateFile(value.file) : undefined,
          }
        }
      }
    },
    onSubmit: ({ value }: { value: TraceFormData }) => {
      createTrace(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

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
    isSubmitting
  }
}
