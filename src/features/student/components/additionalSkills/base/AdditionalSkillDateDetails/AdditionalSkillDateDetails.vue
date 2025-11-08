<script setup lang="ts">
import { useDateUtils } from '@/common/composables'
import { AvIconText, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AdditionalSkillDateDetailsProps {
  createdAt: string | undefined
  updatedAt: string | undefined
}

const { createdAt, updatedAt } = defineProps<AdditionalSkillDateDetailsProps>()

const { t } = useI18n()
const { formatTranslatedDateTime } = useDateUtils()
</script>

<template>
  <div class="date-details">
    <AvIconText
      v-if="createdAt"
      :icon="RI_ICONS.LOADER_LINE"
      :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.added',
               { date: formatTranslatedDateTime(createdAt) })"
    />
    <AvIconText
      v-if="updatedAt"
      :icon="MDI_ICONS.PENCIL_OUTLINE"
      :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.updated',
               { date: formatTranslatedDateTime(updatedAt) })"
    />
  </div>
</template>

<style scoped lang="scss">
.date-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
