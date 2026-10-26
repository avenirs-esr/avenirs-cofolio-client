<script lang="ts" setup>
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { Slot } from 'vue'
import type { EUserCategory } from '@/api/avenir-esr'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import type { UsePaginatedAffiliationsParams } from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'
import { useI18n } from 'vue-i18n'
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
}

const props = defineProps<UsersListProps>()

defineSlots<{
  actions: Slot
}>()

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
  }
})))

const WIDTH_MAP: Record<string, string> = {
  user: '95%',
  actions: '5%'
}

const columns = computed<AvTableColumn<UsersListRow>[]>(() => {
  return (['user', 'actions'] as const).map(key => ({
    key,
    label: t(`staff.admin.usersTable.columns.${key}`),
    width: WIDTH_MAP[key]
  }))
})
</script>

<template>
  <div class="av-col av-gap-sm">
    <SearchEntityInput
      v-model="userInfoSearch"
      :entity-name="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityName')"
      :entity-placeholder="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityPlaceholder')"
    />

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
          data-testid="users-overview-list"
        />
      </Pagination>
    </QuerySuspense>
  </div>
</template>
