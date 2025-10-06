import type { TraceDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useCreateAssociateTraceMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export interface TraceAssociationOption {
  id: string
  title: string
}

export interface AssociateTraceFormData {
  selectedAssociation: TraceAssociationOption | null
}

interface UseAssociateTraceFormOptions {
  trace: TraceDetailDTO
  onAssociated?: () => void
}

export function useAssociateTraceForm (opts: UseAssociateTraceFormOptions) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onAssociateError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.errors.associateTrace'),
      description: error.message,
    })
  }

  const { mutate, isPending } = useCreateAssociateTraceMutation({ onError: onAssociateError })

  const form = useForm({
    defaultValues: {
      selectedAssociation: null,
    } as AssociateTraceFormData,

    validators: {
      onSubmit ({ value }: { value: AssociateTraceFormData }) {
        return {
          fields: {
            selectedAssociation: !value.selectedAssociation
              ? t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.validation.associationRequired')
              : undefined,
          },
        }
      },
    },

    onSubmit: ({ value }: { value: AssociateTraceFormData }) => {
      const selected = value.selectedAssociation
      if (!selected) {
        return
      }

      const associateTraceDTO = {
        amsIds: [] as string[],
        skillLevelIds: [selected.id],
        additionalSkillProgressIds: [] as string[],
      }

      mutate(
        { traceId: opts.trace.id, associateTraceDTO },
        { onSuccess: () => opts.onAssociated?.() }
      )
    },
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending,
  }
}

export type AssociateTraceForm = ReturnType<typeof useAssociateTraceForm>['form']
