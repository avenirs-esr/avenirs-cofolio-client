<script lang="ts" setup>
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ICONS } from '@/common/constants'

export interface UserPermissionsSectionProps {
  user: ExternalUserDetailDTO
}

defineProps<UserPermissionsSectionProps>()

const { t } = useI18n()
</script>

<template>
  <AvIconText
    icon-color="var(--text2)"
    typography-class="n4"
    :icon="ICONS.PERMISSIONS"
    :text="t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.PERMISSIONS.title')"
  />
</template>
