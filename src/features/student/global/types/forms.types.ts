import type { useUpdateActivityForm } from '@/features/student/global/composables/use-update-activity-form/use-update-activity-form'

export type UpdateActivityForm = ReturnType<typeof useUpdateActivityForm>['form']
