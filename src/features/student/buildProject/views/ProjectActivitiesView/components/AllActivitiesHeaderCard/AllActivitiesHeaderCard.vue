<script lang="ts" setup>
import { AvButton, AvCard, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'seeAllEvents'): void
}>()

const { t } = useI18n()
</script>

<template>
  <AvCard
    title-only
    title-background="var(--card2)"
    border-color="transparent"
  >
    <template #title>
      <div class="av-col av-gap-sm">
        <span
          class="s1-regular"
          data-testid="all-activities-header-description"
        >
          {{ t('student.buildProject.views.projectActivitiesView.allActivities.header.description') }}
        </span>
        <div class="av-row av-justify-end">
          <AvButton
            :label="t('student.buildProject.views.projectActivitiesView.allActivities.header.seeAll')"
            variant="OUTLINED"
            :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
            small
            data-testid="all-activities-header-see-all-button"
            @click="$emit('seeAllEvents')"
          />
        </div>
      </div>
    </template>
  </AvCard>
</template>
