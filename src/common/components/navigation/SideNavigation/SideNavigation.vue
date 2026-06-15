<script setup lang="ts">
import { AvSideNavigation, type AvSideNavigationProps, type AvSideNavigationSelectedItem } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface SideNavigationProps extends Omit<AvSideNavigationProps, 'collapseButtonAriaLabel' | 'expandButtonAriaLabel' | 'selectedItem' | 'isSideMenuCollapsed'> { }

const props = defineProps<SideNavigationProps>()
const { t } = useI18n()
const attrs = useAttrs()

const selectedItem = defineModel<AvSideNavigationSelectedItem>('selectedItem', {
  default: () => ({ itemId: '' })
})
const isSideMenuCollapsed = defineModel<boolean>('isSideMenuCollapsed', { default: false })

const avSideNavigationProps = computed(() => ({
  ...attrs,
  ...props,
  collapseButtonAriaLabel: t('global.AvSideMenu.collapseButtonAriaLabel'),
  expandButtonAriaLabel: t('global.AvSideMenu.expandButtonAriaLabel'),
}))
</script>

<template>
  <AvSideNavigation
    v-model:selected-item="selectedItem"
    v-model:is-side-menu-collapsed="isSideMenuCollapsed"
    v-bind="avSideNavigationProps"
  />
</template>
