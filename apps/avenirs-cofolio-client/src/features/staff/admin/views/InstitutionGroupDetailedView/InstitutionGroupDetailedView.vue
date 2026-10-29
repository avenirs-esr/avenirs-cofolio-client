<script setup lang="ts">
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetGroupById, useGetSubGroupsOfGroup } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'
import GroupsList from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.vue'
import UsersList from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.vue'
import GroupMainInfo from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.vue'

export interface InstitutionGroupDetailedViewProps {
  groupId: string
}

const props = defineProps<InstitutionGroupDetailedViewProps>()
const { groupId } = toRefs(props)

const { t } = useI18n()

const { data: group, error, isFetching } = useGetGroupById(groupId)
const { data: subGroups } = useGetSubGroupsOfGroup(groupId, { query: { enabled: !!groupId.value } })
const subGroupsCount = computed(() => subGroups.value?.length ?? 0)

const trailingLinks = computed(() => [{ text: group.value?.name ?? '' }])
</script>

<template>
  <DetailedPageTitle
    :title="group?.name ?? ''"
    :trailing-links="trailingLinks"
  />
  <QuerySuspense
    :is-loading="isFetching"
    :error="error"
    :is-empty="!group"
  >
    <div class="av-col av-gap-md">
      <GroupMainInfo :group="group!" />
      <IconTitleCardContainer
        :title-icon="MDI_ICONS.PEOPLE_GROUP_OUTLINE"
        :title="t('staff.admin.views.InstitutionGroupDetailedView.components.subGroupsSection.title', { count: subGroupsCount })"
        background-color="var(--other-background-base)"
        data-testid="sub-groups-section"
      >
        <GroupsList
          v-if="groupId"
          :group-id="groupId"
        />
      </IconTitleCardContainer>
      <IconTitleCardContainer
        :title-icon="MDI_ICONS.PEOPLE_GROUP_OUTLINE"
        :title="t('staff.admin.views.InstitutionGroupDetailedView.components.usersSection.title', { count: group?.usersCount ?? 0 })"
        background-color="var(--other-background-base)"
        data-testid="users-section"
      >
        <UsersList
          v-if="groupId"
          :group-ids="[groupId]"
          group-users-mode
        />
      </IconTitleCardContainer>
    </div>
  </QuerySuspense>
</template>
