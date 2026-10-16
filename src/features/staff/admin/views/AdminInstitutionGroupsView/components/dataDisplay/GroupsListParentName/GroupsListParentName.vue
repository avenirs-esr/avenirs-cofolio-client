<script lang="ts" setup>
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'

export interface GroupsListParentNameProps {
  group: GroupOverviewDTO
}

const { group } = defineProps<GroupsListParentNameProps>()

const parentNameRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(parentNameRef)
</script>

<template>
  <div
    v-if="group.parentId"
    class="group-list-table-parent-name av-col av-gap-xs"
    data-testid="group-list-table-parent-name"
    :data-group-id="group.parentId"
  >
    <AvTooltip
      v-if="group.parentName"
      :disabled="!isTruncated"
      :content="group.parentName"
    >
      <span
        ref="parentNameRef"
        class="av-max-lines b2-regular av-text-text1"
        data-testid="parent-name"
      >
        {{ group.parentName }}
      </span>
    </AvTooltip>
  </div>
</template>

<style lang="scss" scoped>
.group-list-table-parent-name {
  --max-lines: 2;
}
</style>
