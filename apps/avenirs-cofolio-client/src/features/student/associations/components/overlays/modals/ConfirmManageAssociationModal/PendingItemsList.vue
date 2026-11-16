<script lang="ts" setup>
import type { Association } from '@/features/student/associations/types/associations.types'
import { useI18n } from 'vue-i18n'

export interface ConfirmAssociateModalItemsListProps {
  items: Association[]
}

const { items } = defineProps<ConfirmAssociateModalItemsListProps>()

const { t } = useI18n()

const modalKey = 'student.associations.overlays.modals.ConfirmManageAssociationModal'

const listTitle = computed(() => {
  if (items.length > 0) {
    const contextType = items[0].contextType
    return t(`${modalKey}.PendingItemsList.listTitle.${contextType}`, { count: items.length })
  }
  return ''
})
</script>

<template>
  <div
    v-if="items.length > 0"
    class="av-col av-gap-xs"
  >
    <span class="b2-bold">{{ listTitle }}</span>
    <ul data-testid="confirm-associate-modal__items-list">
      <li
        v-for="item in items"
        :key="item.id"
      >
        <span class="b2-regular av-text-text2">
          {{ item.title }}
        </span>
      </li>
    </ul>
  </div>
</template>
