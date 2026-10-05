<script setup lang="ts">
import { useDateUtils } from '@/common/composables'
import { PLURAL_COUNT_FOR_FEMININE, PLURAL_COUNT_FOR_MASCULINE } from '@/common/utils/constants'
import { AvIconText, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface CreationUpdateDateDetailsProps {
  createdAt?: string
  updatedAt?: string
  hasFeminineLabel?: boolean
}

const { createdAt, updatedAt, hasFeminineLabel = false } = defineProps<CreationUpdateDateDetailsProps>()

const { t } = useI18n()
const { formatTranslatedDateTime } = useDateUtils()

const createdAtValue = computed(() => t('global.dates.createdAt', {
  date: createdAt ? formatTranslatedDateTime(createdAt) : '',
  count: hasFeminineLabel ? PLURAL_COUNT_FOR_FEMININE : PLURAL_COUNT_FOR_MASCULINE,
}))

const updatedAtValue = computed(() => t('global.dates.updatedAt', {
  date: updatedAt ? formatTranslatedDateTime(updatedAt) : '',
  count: hasFeminineLabel ? PLURAL_COUNT_FOR_FEMININE : PLURAL_COUNT_FOR_MASCULINE,
}))
</script>

<template>
  <div
    class="av-col av-gap-xs"
    data-testid="creation-update-date-details"
  >
    <AvIconText
      v-if="createdAt"
      text-color="var(--text2)"
      icon-color="var(--text2)"
      :icon="RI_ICONS.LOADER_LINE"
      :text="createdAtValue"
      data-testid="creation-update-date-details-created-at"
    />

    <AvIconText
      v-if="updatedAt"
      text-color="var(--text2)"
      icon-color="var(--text2)"
      :icon="MDI_ICONS.PENCIL_OUTLINE"
      :text="updatedAtValue"
      data-testid="creation-update-date-details-updated-at"
    />
  </div>
</template>
