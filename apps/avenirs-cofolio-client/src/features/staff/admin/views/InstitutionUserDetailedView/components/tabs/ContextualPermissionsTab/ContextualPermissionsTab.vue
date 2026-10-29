<script lang="ts" setup>
import type { EAuthorizationEntityType, ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { UsePaginatedUserContextualAuthorizationsParams } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-paginated-user-contextual-authorizations/use-paginated-user-contextual-authorizations'
import { AvMessage } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import { useStaffAdminAuthorizationsStore } from '@/features/staff/admin/stores/authorizations.store'
import UserContextualAuthorizationsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserContextualAuthorizationsTable/UserContextualAuthorizationsTable.vue'
import AuthorizationEntityTypeSelect from '@/features/staff/admin/views/InstitutionUserDetailedView/components/selects/AuthorizationEntityTypeSelect/AuthorizationEntityTypeSelect.vue'
import { usePaginatedUserContextualAuthorizations } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-paginated-user-contextual-authorizations/use-paginated-user-contextual-authorizations'

export interface ContextualPermissionsTabProps {
  user: ExternalUserDetailDTO
}

const { user } = defineProps<ContextualPermissionsTabProps>()

const { t } = useI18n()
const staffAdminAuthorizationsStore = useStaffAdminAuthorizationsStore()

const userId = computed(() => user.id)
const entityType = ref<EAuthorizationEntityType | undefined>(undefined)

const usePaginatedUserContextualAuthorizationsParams = computed<UsePaginatedUserContextualAuthorizationsParams>(() => ({
  currentPageRef: toRef(staffAdminAuthorizationsStore, 'authorizationsCurrentPage'),
  pageSizeRef: toRef(staffAdminAuthorizationsStore, 'authorizationsPageSizeSelected'),
  entityTypeRef: entityType,
  userIdRef: userId,
  enabledRef: computed(() => entityType.value !== undefined)
}))

const {
  authorizations,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedUserContextualAuthorizations(usePaginatedUserContextualAuthorizationsParams.value)
</script>

<template>
  <div class="av-col av-gap-sm">
    <AuthorizationEntityTypeSelect
      v-model="entityType"
      :user="user"
    />

    <QuerySuspense
      :is-loading="isFetching"
      :error="error"
      :is-empty="authorizations.length === 0"
      :empty-state-message="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserPermissionsSection.emptyStateMessage')"
      preserve-content
    >
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div class="av-col av-gap-sm">
          <AvMessage
            type="info"
            :message="t('staff.admin.views.InstitutionUserDetailedView.components.sections.UserPermissionsSection.tabs.contextual.info')"
          />
          <UserContextualAuthorizationsTable :contextual-authorizations="authorizations" />
        </div>
      </Pagination>
    </QuerySuspense>
  </div>
</template>
