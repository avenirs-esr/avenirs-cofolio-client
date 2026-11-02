<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { EUserCategory } from '@/api/avenir-esr'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import type { UsePaginatedAffiliationsParams } from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import UsersOverviewList from '@/features/staff/admin/components/base/UsersOverviewList/UsersOverviewList.vue'
import { usePaginatedAffiliations } from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'
import { useStaffAdminUsersStore } from '@/features/staff/admin/stores/users.store'

export interface UsersListProps {
  categories?: EUserCategory[]
  institutionIds?: string[]
  groupIds?: string[]
  groupUsersMode?: boolean
}

const props = defineProps<UsersListProps>()

const { t } = useI18n()
const staffAdminUsersStore = useStaffAdminUsersStore()

const userInfoSearch = ref<string | undefined>(undefined)

const usePaginatedAffiliationsParams = computed<UsePaginatedAffiliationsParams>(() => ({
  pageRef: toRef(staffAdminUsersStore, 'usersCurrentPage'),
  pageSizeRef: toRef(staffAdminUsersStore, 'usersPageSizeSelected'),
  keywordRef: userInfoSearch,
  categoriesRef: toRef(props, 'categories'),
  institutionIdsRef: toRef(props, 'institutionIds'),
  groupIdsRef: toRef(props, 'groupIds'),
}))

const {
  users,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedAffiliations(usePaginatedAffiliationsParams.value)

const rows = computed<UsersListRow[]>(() => users.value.map(user => ({
  id: user.id,
  institutions: user.institutions,
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePictureId: user.profilePictureId
  },
  formations: props.groupUsersMode
    ? []
    : (user.groups?.filter(group => group.type === EGroupType.PROGRAM) ?? []),
  groups: props.groupUsersMode
    ? []
    : (user.groups?.filter(group => group.type !== EGroupType.PROGRAM) ?? [])
})))

const WIDTH_MAP: Record<string, string | undefined> = {
  user: '40%',
  formations: '30%',
  groups: '30%'
}

const columns = computed<AvTableColumn<UsersListRow>[]>(() => {
  const columnKeys = props.groupUsersMode
    ? (['user'] as const)
    : (['user', 'formations', 'groups'] as const)

  return columnKeys.map(key => ({
    key,
    label: t(`staff.admin.usersTable.columns.${key}`),
    width: props.groupUsersMode ? undefined : WIDTH_MAP[key]
  }))
})

watch([userInfoSearch, toRef(props, 'groupIds')], () => {
  staffAdminUsersStore.usersCurrentPage = 0
})
</script>

<template>
  <div class="av-row av-wrap av-align-center av-gap-md">
    <SearchEntityInput
      v-model="userInfoSearch"
      :entity-name="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityName')"
      :entity-placeholder="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityPlaceholder')"
    />
    <slot />
  </div>
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="rows.length === 0"
    :empty-state-message="t('global.information.noResults')"
    preserve-content
  >
    <Pagination
      v-if="pageInfo"
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <UsersOverviewList
        :rows="rows"
        :columns="columns"
        :group-users-mode="groupUsersMode"
        data-testid="users-overview-list"
      />
    </Pagination>
  </QuerySuspense>
</template>
