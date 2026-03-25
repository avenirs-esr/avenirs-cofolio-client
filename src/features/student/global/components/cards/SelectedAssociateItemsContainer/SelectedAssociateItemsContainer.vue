<script lang="ts" setup>
import type { IdTitle, IdTitleList } from '@/types'
import DeleteOverlay from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelectedAssociateItemsContainerProps {
  items: IdTitleList
}

defineProps<SelectedAssociateItemsContainerProps>()

defineEmits<{
  (e: 'delete', itemId: string): void
}>()

defineSlots<{
  item: (props: { item: IdTitle }) => unknown
}>()

const { t } = useI18n()
</script>

<template>
  <div class="av-h-full av-col av-gap-md">
    <span class="av-label b2-light">
      {{
        t('student.global.cards.SelectedAssociateItemContainer.label', { count: items.length })
      }}
    </span>

    <AvCard
      class="av-flex-fill"
      title-background="var(--card2)"
      background-color="var(--surface-background)"
      border-color="transparent"
    >
      <div class="selected-associate-items-container__list av-h-full av-col av-gap-sm">
        <DeleteOverlay
          v-for="item in items"
          :key="item.id"
          class="av-w-full"
          @delete="$emit('delete', item.id)"
        >
          <slot
            name="item"
            :item="item"
          />
        </DeleteOverlay>
      </div>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.selected-associate-items-container__list {
  overflow-y: auto;
}
</style>
