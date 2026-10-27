<script lang="ts" setup>
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { AvIconText, AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import { ICONS } from '@/common/constants'
import ContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/ContextualPermissionsTab/ContextualPermissionsTab.vue'
import NotContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/NotContextualPermissionsTab/NotContextualPermissionsTab.vue'

export interface UserPermissionsSectionProps {
  user: ExternalUserDetailDTO
  isLoading?: boolean
  error?: BaseApiException | null
}

const { user, isLoading, error } = defineProps<UserPermissionsSectionProps>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    icon-color="var(--text2)"
    typography-class="n4"
    :icon="ICONS.PERMISSIONS"
    :text="t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.PERMISSIONS.title')"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
  >
    <AvTabs>
      <AvTab :title="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserPermissionsSection.tabs.notContextual.title')">
        <NotContextualPermissionsTab :user="user" />
      </AvTab>
      <AvTab :title="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserPermissionsSection.tabs.contextual.title')">
        <ContextualPermissionsTab :user="user" />
      </AvTab>
    </AvTabs>
  </QuerySuspense>
</template>
