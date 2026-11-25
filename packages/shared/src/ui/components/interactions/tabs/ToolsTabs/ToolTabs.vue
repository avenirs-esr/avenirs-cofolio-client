<script setup lang="ts">
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import ToolsPaginatedList from '#shared/ui/components/interactions/lists/ToolsPaginatedList/ToolsPaginatedList.vue'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ToolTabsProps {
  localBaseRouteName?: string
  nationalBaseRouteName?: string
  regionalBaseRouteName?: string
}

defineProps<ToolTabsProps>()

const i18nKey = 'global.components.interactions.tabs.ToolTabs'

const { t } = useI18n()
</script>

<template>
  <AvTabs>
    <AvTab
      :icon="ICONS.NATIONAL"
      :title="t(`${i18nKey}.nationalTools`)"
    >
      <ToolsPaginatedList
        :type="EToolType.NATIONAL"
        :base-route-name="nationalBaseRouteName"
      />
    </AvTab>
    <AvTab
      :icon="ICONS.REGIONAL"
      :title="t(`${i18nKey}.regionalTools`)"
    >
      <ToolsPaginatedList
        :type="EToolType.REGIONAL"
        :base-route-name="regionalBaseRouteName"
      />
    </AvTab>
    <AvTab
      :icon="ICONS.LOCAL"
      :title="t(`${i18nKey}.localTools`)"
    >
      <ToolsPaginatedList
        :type="EToolType.LOCAL"
        :base-route-name="localBaseRouteName"
      />
    </AvTab>
  </AvTabs>
</template>
