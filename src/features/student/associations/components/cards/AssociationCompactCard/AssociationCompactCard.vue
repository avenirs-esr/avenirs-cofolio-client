<script lang="ts" setup>
import type { EActivityThematic } from '@/api/avenir-esr'
import type { Association } from '@/features/student/associations/types/associations.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvBadge, ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'

export interface AssociationCompactCardProps {
  contextType: EAssociationContextType
  association: Association
}

const { contextType, association } = defineProps<AssociationCompactCardProps>()

const isDark = computed(() => contextType === EAssociationContextType.DECLARED_SKILL)
const textColor = computed(() => isDark.value ? 'var(--card)' : 'var(--text1)')
const hoverBorderColor = computed(() => isDark.value ? 'var(--other-border-skill-card)' : undefined)

const iconOptions = computed(() => ({
  name: ASSOCIATION_TYPE_ICONS[contextType],
  color: isDark.value ? 'var(--card)' : 'var(--icon)',
  bottom: '-2.5rem',
  borderColor: 'var(--other-border-skill-card)'
}))
</script>

<template>
  <FloatingIconCard
    :title="association.title"
    :title-color="textColor"
    :color="isDark ? 'var(--dark-background-primary1)' : 'var(--light-background-neutral)'"
    :icon-options="iconOptions"
    border-color="var(--other-border-skill-card)"
    :border-color-on-hover="hoverBorderColor"
    :header-rows="2"
    height="7.5rem"
    custom-title-height="4rem"
    title-typography-classes="caption-regular"
    data-testid="association-compact-card"
  >
    <template
      v-if="association.category && association.description"
      #body
    >
      <div
        v-if="contextType === EAssociationContextType.DECLARED_ACTIVITY"
        class="av-row"
      >
        <ActivityThematicBadge
          :thematic="association.category as EActivityThematic"
          small
        />
      </div>
      <AvBadge
        v-else-if="contextType === EAssociationContextType.DECLARED_SKILL"
        :label="association.description"
        color="var(--text1)"
        border-color="var(--other-border-skill-card)"
        background-color="var(--surface-background)"
        :icon="ICONS_DATA_URL.MDI_BOOKMARK_CHECK"
        small
        ellipsis
      />
    </template>
  </FloatingIconCard>
</template>
