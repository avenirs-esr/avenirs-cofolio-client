<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGetExternalUser, useGetGroupById } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { toFullName } from '@/common/utils/user/user'
import { staffAdminGroupRoute } from '@/features/staff/admin/routes'
import UserLayout from '@/features/staff/admin/views/InstitutionUserDetailedView/components/layout/UserLayout/UserLayout.vue'

export interface InstitutionUserDetailedView {
  userId: string
  groupId?: string
}

const props = defineProps<InstitutionUserDetailedView>()

const { t } = useI18n()
const { isStaffAdminGroupsRoute } = useIdentifyRoute()

const groupId = computed(() => props.groupId ?? '')
const { data: group } = useGetGroupById(groupId, { query: { enabled: !!groupId.value } })

const { userId } = toRefs(props)
const { data: user, error, isFetching } = useGetExternalUser(userId)

const fullName = computed(() => toFullName(user.value?.firstName, user.value?.lastName))

const currentSection = ref('')

const trailingLinks = computed(() => {
  return [
    ...(isStaffAdminGroupsRoute.value && groupId.value
      ? [
          {
            text: group.value?.name ?? '',
            to: { name: staffAdminGroupRoute.name, params: { id: groupId.value } }
          },
          { text: t(META_BREADCRUMBS.STAFF.ADMIN.USERS.textKey) }
        ]
      : []),
    { text: fullName.value ?? '' },
    { text: currentSection.value }
  ]
})
</script>

<template>
  <DetailedPageTitle
    :title="fullName"
    :trailing-links="trailingLinks"
  />
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
  >
    <UserLayout
      :user="user!"
      @selected-section="currentSection = $event"
    />
  </QuerySuspense>
</template>
