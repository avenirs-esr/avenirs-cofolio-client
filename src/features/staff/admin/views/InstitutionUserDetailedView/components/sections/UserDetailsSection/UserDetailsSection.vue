<script lang="ts" setup>
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetGlobalAuthorizationOfExternalUser } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import UserDetailsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserDetailsTable/UserDetailsTable.vue'

export interface UserDetailsSectionProps {
  user: ExternalUserDetailDTO
}

const { user } = defineProps<UserDetailsSectionProps>()

const { t } = useI18n()

const userId = computed(() => user.id)
const { data: authorizations } = useGetGlobalAuthorizationOfExternalUser(userId.value, { query: { enabled: !!userId.value } })
const universes = computed(() => authorizations?.value?.universes ?? [])
</script>

<template>
  <div class="av-col av-gap-sm">
    <AvIconText
      icon-color="var(--text2)"
      typography-class="n4"
      :icon="ICONS.USER"
      :text="t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.DETAILS.title')"
    />
    <UserDetailsTable
      :user="user"
      :universes="universes"
    />
  </div>
</template>
