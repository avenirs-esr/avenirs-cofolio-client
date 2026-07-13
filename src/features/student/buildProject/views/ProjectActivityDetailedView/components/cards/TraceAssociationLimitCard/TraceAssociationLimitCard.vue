<script setup lang="ts">
import Card from '@/common/components/cards/Card/Card.vue'
import { AvBadge, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAssociationLimitCardProps {
  traceAllowedAssociations: number
}

const { traceAllowedAssociations } = defineProps<TraceAssociationLimitCardProps>()

const { t } = useI18n()

const translationKey = 'student.buildProject.activities.views.ProjectActivityDetailedView.AssociationLimitCard'

const associationLimitLabel = computed(() => {
  const key = 'student.buildProject.activities.views.ProjectActivityDetailedView.AssociationLimitCard'

  if (traceAllowedAssociations === -1) {
    return t(`${key}.unlimited`)
  }

  return t(`${key}.count`, {
    count: traceAllowedAssociations,
  })
})
</script>

<template>
  <Card
    v-if="traceAllowedAssociations !== 0"
    background-color="var(--card2)"
    title-background="var(--card2)"
    data-testid="association-limit-card"
  >
    <template #body>
      <AvIconText
        typography-class="n6"
        :icon="MDI_ICONS.ALERT_OUTLINE"
        icon-color="var(--text1)"
        :text="t(`${translationKey}.title`)"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="association-limit-card-title"
      />
    </template>

    <template #footer>
      <AvBadge
        data-testid="association-limit-card-badge"
        :label="associationLimitLabel"
        :icon="MDI_ICONS.ATTACH_FILE"
        color="var(--text1)"
        background-color="var(--light-background-neutral)"
        border-color="transparent"
      />
    </template>
  </Card>
</template>
