import type { useUpdateActivityForm } from '@/features/student/buildProject/components/overlays/UpdateActivityDrawer/use-update-activity-form/use-update-activity-form'
import type { useSubscribeActivityForm } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/use-subscribe-activity-form/use-subscribe-activity-form'

export type SubscribeActivityForm = ReturnType<typeof useSubscribeActivityForm>['form']
export type UpdateActivityForm = ReturnType<typeof useUpdateActivityForm>['form']
