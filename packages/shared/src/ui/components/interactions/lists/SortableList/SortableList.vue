<script lang="ts" setup generic="T extends AvSortableListItem">
import type { AvSortableListItem, AvSortableListProps, AvSortableListSlotProps } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, VNode } from 'vue'
import { AvSortableList } from '@avenirs-esr/avenirs-dsav'
import { computed, useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

export interface SortableListProps<T extends AvSortableListItem>
  extends Omit<AvSortableListProps<T>, 'dragLabel' | 'moveUpLabel'
    | 'moveUpDisabledTooltip' | 'moveDownLabel' | 'moveDownDisabledTooltip'> {}

const props = defineProps<SortableListProps<T>>()

defineSlots<{
  default?: (props: AvSortableListSlotProps<T>) => VNode[]
}>()

const { t } = useI18n()
const attrs = useAttrs()

const avSortableListProps: ComputedRef<AvSortableListProps<T>> = computed(() => ({
  ...attrs,
  ...props,
  dragLabel: t('global.components.interactions.lists.SortableList.dragLabel'),
  moveUpLabel: t('global.components.interactions.lists.SortableList.moveUpLabel'),
  moveUpDisabledTooltip: t('global.components.interactions.lists.SortableList.moveUpDisabledTooltip'),
  moveDownLabel: t('global.components.interactions.lists.SortableList.moveDownLabel'),
  moveDownDisabledTooltip: t('global.components.interactions.lists.SortableList.moveDownDisabledTooltip'),
}))
</script>

<template>
  <AvSortableList v-bind="avSortableListProps">
    <template #default="{ element, index }">
      <slot
        :element="element"
        :index="index"
      />
    </template>
  </AvSortableList>
</template>
