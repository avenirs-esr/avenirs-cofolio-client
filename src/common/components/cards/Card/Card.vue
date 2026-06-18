<script setup lang="ts">
import { AvCard, type AvCardProps } from '@avenirs-esr/avenirs-dsav'
import { type ComputedRef, type Slot, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface CardProps extends Omit<AvCardProps, 'collapseLabel' | 'expandLabel'> { }

const props = defineProps<CardProps>()

const slots = defineSlots<{
  title?: Slot<{ collapsed: boolean }>
  body?: Slot
  footer?: Slot
  default?: Slot
}>()

const { t } = useI18n()
const attrs = useAttrs()

const avCardProps: ComputedRef<AvCardProps> = computed(() => ({
  ...attrs,
  ...props,
  collapseLabel: t('global.buttons.collapse'),
  expandLabel: t('global.buttons.expand')
}))
</script>

<template>
  <AvCard
    v-bind="avCardProps"
  >
    <template
      v-if="slots.title"
      #title="{ collapsed }"
    >
      <slot
        name="title"
        :collapsed="collapsed"
      />
    </template>
    <template
      v-if="slots.body"
      #body
    >
      <slot name="body" />
    </template>
    <template
      v-if="slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
    <template #default>
      <slot />
    </template>
  </AvCard>
</template>
