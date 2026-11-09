<script lang="ts" setup>
import type { ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { QuerySuspense } from '@avenirs-esr/shared'
import { useGetGlobalAuthorizationOfExternalUser } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import UserPermissionsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserPermissionsTable/UserPermissionsTable.vue'

export interface UserPermissionsSectionProps {
  user: ExternalUserDetailDTO
}

const { user } = defineProps<UserPermissionsSectionProps>()

const { t } = useI18n()

const userId = computed(() => user.id)

const {
  data: authorizations,
  isLoading,
  error
} = useGetGlobalAuthorizationOfExternalUser(userId.value, { query: { enabled: !!userId.value } })

const roles = computed(() => authorizations?.value?.roles ?? [])
</script>

<template>
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :is-empty="roles.length === 0"
    :empty-state-message="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserPermissionsSection.emptyStateMessage')"
  >
    <UserPermissionsTable :roles="roles" />
  </QuerySuspense>
</template>
