<script setup lang="ts">
import { useGetGroupById } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'
import GroupMainInfo from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.vue'

export interface InstitutionGroupDetailedViewProps {
  groupId: string
}

const props = defineProps<InstitutionGroupDetailedViewProps>()
const { groupId } = toRefs(props)

const { data: group, error, isFetching } = useGetGroupById(groupId)

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
    <GroupMainInfo :group="group!" />
  </QuerySuspense>
</template>
