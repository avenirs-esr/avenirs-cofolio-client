<script lang="ts" setup>
import type { EActivityThematic, FileDTO } from '@/api/avenir-esr'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'

export interface ActivityCatalogHeaderProps {
  title: string
  thematic: EActivityThematic
  banner?: FileDTO
  subscribedDeclaredActivity?: string
}

const {
  title,
  thematic,
  banner,
  subscribedDeclaredActivity,
} = defineProps<ActivityCatalogHeaderProps>()
</script>

<template>
  <div class="av-col av-gap-lg">
    <Card
      v-if="banner"
      background-color="var(--card2)"
      border-color="transparent"
      class="activity-banner-container"
    >
      <img
        :src="banner.url"
        :alt="banner.fileName"
        class="activity-banner av-w-full av-h-full av-radius-2xl"
        data-testid="activity-banner"
      >
    </Card>
    <div class="av-col av-gap-md">
      <AvIconText
        :icon="ICONS.ACTIVITY"
        icon-color="var(--icon)"
        :text="title"
        text-color="var(--dark-background-primary1)"
        typography-class="n2"
        gap="var(--spacing-md)"
        inline
        wrap-anywhere
        data-testid="activity-title"
      />
      <div class="av-row av-wrap av-gap-xs av-pl-5xl">
        <ActivityThematicBadge
          :thematic="thematic"
          data-testid="activity-thematic-badge"
        />
        <DeclaredActivityStatusBadge
          v-if="subscribedDeclaredActivity"
          :status="EDeclaredActivityStatus.SUBSCRIBED"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activity-banner-container {
  height: 18.75rem;
}

.activity-banner {
  object-fit: cover;
}
</style>
