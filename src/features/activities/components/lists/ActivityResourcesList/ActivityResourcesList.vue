<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import ActivityResourceCard from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.vue'

export interface ActivityResourcesListProps {
  activityId: string
  files: (FileDTO | File)[]
  links: string[]
  readonly?: boolean
}

const {
  activityId,
  files,
  links,
  readonly = false
} = defineProps<ActivityResourcesListProps>()
</script>

<template>
  <div
    class="activity-resources-list av-row"
    data-testid="activity-resources-list"
  >
    <div class="av-col av-w-full">
      <div class="activity-resources-list-content av-row av-wrap av-gap-xs av-p-md av-radius-2xl av-border-width-sm av-border-style-solid">
        <ActivityResourceCard
          v-for="(resource, index) in [...files, ...links]"
          :key="`resource-${index}`"
          :activity-id="activityId"
          :resource="resource"
          :disabled="readonly"
          tooltip-visible
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-resources-list-content {
  background: var(--other-background-base);
  border-color: var(--stroke);
}
</style>
