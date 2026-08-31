<script lang="ts" setup>
import type { EActivityThematic } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ICONS } from '@/common/constants'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

export interface DeclaredActivityCompactCardProps {
  activity: IdTitle & { thematic?: EActivityThematic }
}

const { activity } = defineProps<DeclaredActivityCompactCardProps>()

const iconOptions = computed(() => ({
  name: ICONS.ACTIVITY,
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))
</script>

<template>
  <FloatingIconCard
    :title="activity.title"
    title-color="var(--text1)"
    color="var(--light-background-neutral)"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="7.5rem"
    custom-title-height="4rem"
    title-typography-classes="caption-regular"
  >
    <template
      v-if="activity.thematic"
      #body
    >
      <div class="av-row">
        <ActivityThematicBadge
          :thematic="activity.thematic"
          :small="true"
        />
      </div>
    </template>
  </FloatingIconCard>
</template>
