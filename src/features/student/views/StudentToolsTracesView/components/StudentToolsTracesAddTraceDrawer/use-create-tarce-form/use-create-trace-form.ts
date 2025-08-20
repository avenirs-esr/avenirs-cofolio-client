import type { TraceFormData } from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useCreateTraceForm () {
  const { t } = useI18n()

  // TODO: Implement the createTrace function to handle the trace creation logic.
  // eslint-disable-next-line unused-imports/no-unused-vars
  async function createTrace (traceFormData: TraceFormData) {

  }

  const form = useForm({
    defaultValues: {
      file: null as unknown as File,
      traceName: '',
      personalNote: ''
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: !value.file ? t('global.error.form.requiredFiled') : undefined,
            traceName: !value.traceName.trim() ? t('global.error.form.requiredFiled') : undefined,
          }
        }
      }
    },
    onSubmit: async ({ value }: { value: TraceFormData }) => {
      await createTrace(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid
  }
}

export type CreateTraceForm = ReturnType<typeof useCreateTraceForm>['form']
