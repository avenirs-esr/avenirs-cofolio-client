<script lang="ts" setup>
import type { IconOptions } from '@avenirs-esr/shared'
import type { EActivityThematic } from '@avenirs-esr/shared/api/avenir-esr'
import type { Association } from '@/features/student/associations/types/associations.types'
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { COLORS, FloatingIconCard } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'

export interface AssociationCompactCardProps {
  contextType: EAssociationContextType
  association: Association
}

const { contextType, association } = defineProps<AssociationCompactCardProps>()

const color = computed(() => COLORS[contextType])

const iconOptions = computed<IconOptions>(() => ({
  name: ASSOCIATION_TYPE_ICONS[contextType],
  color: 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--stroke)'
}))
</script>

<template>
  <FloatingIconCard
    :title="association.title"
    title-color="var(--text1)"
    :color="color"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :header-rows="2"
    height="7.5rem"
    custom-title-height="4rem"
    title-typography-classes="caption-regular"
    :hoverable="false"
    data-testid="association-compact-card"
  >
    <template
      v-if="association.description"
      #body
    >
      <div
        v-if="contextType === EAssociationContextType.DECLARED_ACTIVITY && association.category"
        class="av-row"
      >
        <ActivityThematicBadge
          :thematic="association.category as EActivityThematic"
          small
        />
      </div>
      <AvBadge
        v-else-if="contextType === EAssociationContextType.DECLARED_SKILL && association.category"
        :label="association.description"
        color="var(--text1)"
        border-color="var(--other-border-skill-card)"
        background-color="var(--surface-background)"
        :icon="ICONS_DATA_URL.MDI_BOOKMARK_CHECK"
        small
        ellipsis
      />
      <span
        v-else-if="contextType === EAssociationContextType.TRACE"
        class="caption-light"
        data-testid="association-compact-card-info"
      >{{ association.description }}</span>
    </template>
  </FloatingIconCard>
</template>
