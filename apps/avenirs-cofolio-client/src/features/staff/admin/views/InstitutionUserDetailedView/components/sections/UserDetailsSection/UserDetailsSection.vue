<script lang="ts" setup>
import type { BaseApiException } from '@avenirs-esr/shared'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetGlobalAuthorizationOfExternalUser } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import { ICONS } from '@/common/constants'
import UserDetailsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserDetailsTable/UserDetailsTable.vue'

export interface UserDetailsSectionProps {
  user: ExternalUserDetailDTO
  isLoading?: boolean
  error?: BaseApiException | null
}

const { user, isLoading: isLoadingProp, error: errorProp } = defineProps<UserDetailsSectionProps>()

const { t } = useI18n()

const userId = computed(() => user.id)
const { data: authorizations, isLoading: isLoadingAuthorizations, error: errorAuthorizations } = useGetGlobalAuthorizationOfExternalUser(userId.value, { query: { enabled: !!userId.value } })

const universes = computed(() => authorizations?.value?.universes ?? [])
const isLoading = computed(() => isLoadingProp || isLoadingAuthorizations.value)
const error = computed(() => errorProp || errorAuthorizations.value)
</script>

<template>
  <div class="av-col av-gap-sm">
    <AvIconText
      icon-color="var(--text2)"
      typography-class="n4"
      :icon="ICONS.USER"
      :text="t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.DETAILS.title')"
    />
    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
    >
      <UserDetailsTable
        :user="user"
        :universes="universes"
      />
    </QuerySuspense>
  </div>
</template>
