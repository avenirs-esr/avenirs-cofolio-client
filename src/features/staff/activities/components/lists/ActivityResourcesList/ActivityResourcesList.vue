<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import AddCard from '@/common/components/cards/AddCard/AddCard.vue'
import ActivityResourceCard from '@/features/staff/activities/components/cards/ActivityResourceCard/ActivityResourceCard.vue'

export interface ActivityResourcesListProps {
  files: (File | FileDTO)[]
  links: string[]
  showAddCard?: boolean
}

const {
  files,
  links,
  showAddCard = false
} = defineProps<ActivityResourcesListProps>()

const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>

<template>
  <div
    class="activity-resources-list av-row av-wrap av-gap-md av-p-md av-radius-2xl av-border-width-sm av-border-style-solid av-justify-between"
    data-testid="activity-resources-list"
  >
    <ActivityResourceCard
      v-for="(file, index) in files"
      :key="`file-${index}`"
      :resource="file"
    />
    <ActivityResourceCard
      v-for="(link, index) in links"
      :key="`link-${index}`"
      :resource="link"
    />
    <AddCard
      v-if="showAddCard"
      data-testid="activity-resources-list-add-card"
      @click="emit('add')"
    />
  </div>
</template>

<style scoped lang="scss">
.activity-resources-list {
  background: var(--other-background-base);
  border-color: var(--stroke)
}
</style>
