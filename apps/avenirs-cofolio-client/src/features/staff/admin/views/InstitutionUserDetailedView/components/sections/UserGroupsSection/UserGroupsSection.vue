<script lang="ts" setup>
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import { ICONS } from '@/common/constants'
import { getUserGroupsByTypeExcluding } from '@/features/staff/admin/utils/groups.utils'
import UserGroupsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserGroupsTable/UserGroupsTable.vue'

export interface UserGroupsSectionProps {
  user: ExternalUserDetailDTO
  isLoading?: boolean
  error?: BaseApiException | null
}

const { user } = defineProps<UserGroupsSectionProps>()

const { t } = useI18n()

const isEmpty = computed(() => getUserGroupsByTypeExcluding(user, EGroupType.PROGRAM).length === 0)
</script>

<template>
  <AvIconText
    icon-color="var(--text2)"
    typography-class="n4"
    :icon="ICONS.GROUPS"
    :text="t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.GROUPS.title')"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :is-empty="isEmpty"
    :empty-state-message="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserGroupsSection.emptyStateMessage')"
  >
    <UserGroupsTable :user="user" />
  </QuerySuspense>
</template>
