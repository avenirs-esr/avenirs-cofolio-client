<script setup lang="ts">
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import ToolsPaginatedList from '#shared/ui/components/interactions/lists/ToolsPaginatedList/ToolsPaginatedList.vue'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ToolTabsProps {
  localBaseRouteName?: string
  nationalBaseRouteName?: string
  regionalBaseRouteName?: string
}

const { localBaseRouteName, nationalBaseRouteName, regionalBaseRouteName } = defineProps<ToolTabsProps>()

const i18nKey = 'global.components.interactions.tabs.ToolTabs'

const { t } = useI18n()

const toolsCount = ref<Record<EToolType, number>>({
  [EToolType.NATIONAL]: 0,
  [EToolType.REGIONAL]: 0,
  [EToolType.LOCAL]: 0,
})

const avTabProps = computed(() => ({
  [EToolType.NATIONAL]: {
    icon: ICONS.NATIONAL,
    title: t(`${i18nKey}.nationalTools`, { count: toolsCount.value[EToolType.NATIONAL] }),
  },
  [EToolType.REGIONAL]: {
    icon: ICONS.REGIONAL,
    title: t(`${i18nKey}.regionalTools`, { count: toolsCount.value[EToolType.REGIONAL] }),
  },
  [EToolType.LOCAL]: {
    icon: ICONS.LOCAL,
    title: t(`${i18nKey}.localTools`, { count: toolsCount.value[EToolType.LOCAL] }),
  }
}))

const baseRouteNames = computed(() => ({
  [EToolType.NATIONAL]: nationalBaseRouteName,
  [EToolType.REGIONAL]: regionalBaseRouteName,
  [EToolType.LOCAL]: localBaseRouteName
}))

function onCountUpdate (type: EToolType, value: number) {
  toolsCount.value[type] = value
}
</script>

<template>
  <AvTabs :lazy-render="false">
    <AvTab
      v-for="type in Object.values(EToolType)"
      :key="type"
      v-bind="avTabProps[type]"
    >
      <ToolsPaginatedList
        :type="type"
        :base-route-name="baseRouteNames[type]"
        @count="onCountUpdate"
      />
    </AvTab>
  </AvTabs>
</template>
