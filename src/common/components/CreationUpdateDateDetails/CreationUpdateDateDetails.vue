<script setup lang="ts">
import { useDateUtils } from '@/common/composables'
import { AvIconText, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AdditionalSkillDateDetailsProps {
  createdAt?: string
  updatedAt?: string
  createdAtPrefix?: string
}

const { createdAt, updatedAt, createdAtPrefix } = defineProps<AdditionalSkillDateDetailsProps>()

const { t } = useI18n()
const { formatTranslatedDateTime } = useDateUtils()

const createdAtValue = computed(() => {
  const formattedDate = createdAt ? formatTranslatedDateTime(createdAt) : ''

  if (!createdAtPrefix) {
    return t('global.dates.createdAt', { date: formattedDate })
  }

  return t('global.dates.createdAtWithPrefix', { date: formattedDate, prefix: createdAtPrefix })
})

const updatedAtValue = computed(() => t('global.dates.updatedAt', {
  date: updatedAt ? formatTranslatedDateTime(updatedAt) : '',
}))
</script>

<template>
  <div class="av-col av-gap-xs">
    <AvIconText
      v-if="createdAt"
      text-color="var(--text2)"
      icon-color="var(--text2)"
      :icon="RI_ICONS.LOADER_LINE"
      :text="createdAtValue"
    />

    <AvIconText
      v-if="updatedAt"
      text-color="var(--text2)"
      icon-color="var(--text2)"
      :icon="MDI_ICONS.PENCIL_OUTLINE"
      :text="updatedAtValue"
    />
  </div>
</template>
