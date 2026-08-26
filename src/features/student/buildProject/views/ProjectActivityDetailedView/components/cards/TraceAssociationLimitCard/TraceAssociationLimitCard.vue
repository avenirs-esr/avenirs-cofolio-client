<script setup lang="ts">
import {
  isActivityAssociationToTraceDisabled,
  isActivityAssociationToTraceLimited,
  isActivityAssociationToTraceUnlimited,
} from '@/common/activities/rules/activities.rules'
import WarningBadge from '@/common/components/badges/WarningBadge/WarningBadge.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { AvBadge, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAssociationLimitCardProps {
  traceAllowedAssociations: number
  icon?: string
  title?: string
}

const { traceAllowedAssociations, icon, title } = defineProps<TraceAssociationLimitCardProps>()

const { t } = useI18n()

const translationKey = 'student.buildProject.activities.views.ProjectActivityDetailedView.AssociationLimitCard'

const associationLimitLabel = computed(() => {
  switch (true) {
    case isActivityAssociationToTraceUnlimited({ traceAllowedAssociations }):
      return t(`${translationKey}.unlimited`)
    case isActivityAssociationToTraceDisabled({ traceAllowedAssociations }):
      return t(`${translationKey}.disabled`)
    default:
      return t(`${translationKey}.count`, {
        count: traceAllowedAssociations,
      })
  }
})

const associationLimited = computed(() => isActivityAssociationToTraceLimited({ traceAllowedAssociations }))
</script>

<template>
  <Card
    background-color="var(--card)"
    title-background="var(--card)"
    data-testid="association-limit-card"
  >
    <template #title>
      <AvIconText
        typography-class="n6"
        :icon="icon ?? MDI_ICONS.ALERT_OUTLINE"
        icon-color="var(--dark-background-primary1)"
        :text="title ?? t(`${translationKey}.title`)"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="association-limit-card-title"
        :wrap-anywhere="true"
      />
    </template>

    <template #footer>
      <WarningBadge
        v-if="associationLimited"
        data-testid="association-limit-card-limited-badge"
        :label="associationLimitLabel"
        :icon="MDI_ICONS.ATTACH_FILE"
      />
      <AvBadge
        v-else
        data-testid="association-limit-card-unlimited-disabled-badge"
        :label="associationLimitLabel"
        :icon="MDI_ICONS.ATTACH_FILE"
        color="var(--text1)"
        background-color="var(--light-background-neutral)"
        border-color="transparent"
      />
    </template>
  </Card>
</template>
