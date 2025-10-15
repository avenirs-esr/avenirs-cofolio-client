import type {
  useCreateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import type {
  useUpdateTraceForm
} from '@/features/student/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'

export type UpdateTraceForm = ReturnType<typeof useUpdateTraceForm>['form']
export type CreateTraceForm = ReturnType<typeof useCreateTraceForm>['form']
