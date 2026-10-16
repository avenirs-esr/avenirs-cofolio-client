<script setup lang="ts">
import { useGetGroupById } from '@/api/avenir-esr'
import DetailedPageTitle from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.vue'

export interface InstitutionGroupDetailedViewProps {
  groupId: string
}

const props = defineProps<InstitutionGroupDetailedViewProps>()
const { groupId } = toRefs(props)

const { data: group } = useGetGroupById(groupId)

const trailingLinks = computed(() => [{ text: group.value?.name ?? '' }])
</script>

<template>
  <DetailedPageTitle
    :title="group?.name ?? ''"
    :trailing-links="trailingLinks"
  />
</template>
