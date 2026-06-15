<script setup lang="ts">
import { AvSideMenu, type AvSideMenuProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface SideMenuProps extends Omit<AvSideMenuProps, 'collapseButtonAriaLabel' | 'expandButtonAriaLabel' | 'collapsed'> { }

const {
  collapsible = true,
  width = '16rem',
  collapsedWidth = '5rem',
  padding = '0',
  hideContentWhenCollapsed = false,
  sticky = false,
  stickyOffset = '0',
  ...props
} = defineProps<SideMenuProps>()
const { t } = useI18n()
const attrs = useAttrs()

const collapsed = defineModel<boolean>('collapsed', { default: false })

const avSideMenuProps = computed(() => ({
  ...attrs,
  ...props,
  collapsible,
  width,
  collapsedWidth,
  padding,
  hideContentWhenCollapsed,
  sticky,
  stickyOffset,
  collapseButtonAriaLabel: t('global.AvSideMenu.collapseButtonAriaLabel'),
  expandButtonAriaLabel: t('global.AvSideMenu.expandButtonAriaLabel'),
}))
</script>

<template>
  <AvSideMenu
    v-model:collapsed="collapsed"
    v-bind="avSideMenuProps"
  >
    <slot />
  </AvSideMenu>
</template>
