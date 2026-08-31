<script lang="ts" setup>
import Card from '@/common/components/cards/Card/Card.vue'
import { AvButton, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'seeAllActivities'): void
}>()

const { t } = useI18n()
</script>

<template>
  <Card
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
          {{ t('student.buildProject.views.projectActivitiesView.allActivitiesTab.header.description') }}
        </span>
        <div class="av-row av-justify-end">
          <AvButton
            :label="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.header.seeAll')"
            variant="OUTLINED"
            :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
            small
            data-testid="all-activities-header-see-all-button"
            @click="$emit('seeAllActivities')"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
