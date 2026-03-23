<script lang="ts" setup>
import type { EActivityThematic } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import ActivityThematicBadge from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { ICONS } from '@/features/student/global/icons'

export interface ActivityCompactCardProps {
  activity: IdTitle
  thematic?: EActivityThematic
}

const { thematic } = defineProps<ActivityCompactCardProps>()

const iconOptions = computed(() => ({
  name: ICONS.ACTIVITY,
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))

const height = computed(() => thematic ? '8.5rem' : '5.75rem')
</script>

<template>
  <FloatingIconCard
    :title="activity.title"
    title-color="var(--text1)"
    color="var(--surface-background)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    title-typography-classes="caption-regular"
    :height
  >
    <template
      v-if="thematic"
      #body
    >
      <div class="av-row">
        <ActivityThematicBadge
          :thematic="thematic"
          small
        />
      </div>
    </template>
  </FloatingIconCard>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 13.75rem !important;
  max-width: 13.75rem !important;
}
</style>
