<script lang="ts" setup generic="U extends IdTitle = IdTitle">
import type { IdTitle } from '@/types'
import type { AvButtonProps } from '@avenirs-esr/avenirs-dsav'
import Card from '@/common/components/cards/Card/Card.vue'
import DeleteOverlay from '@/features/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'
import { useI18n } from 'vue-i18n'

export interface SelectedAssociateItemsContainerProps<U extends IdTitle = IdTitle> {
  items: U[]
  buttonTheme?: AvButtonProps['theme']
}

defineProps<SelectedAssociateItemsContainerProps<U>>()

defineEmits<{
  (e: 'delete', itemId: string): void
}>()

defineSlots<{
  item: (props: { item: U }) => unknown
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

    <Card
      class="av-flex-fill"
      title-background="var(--card2)"
      background-color="var(--surface-background)"
      border-color="transparent"
    >
      <div class="selected-associate-items-container__list av-h-full av-col av-gap-sm">
        <DeleteOverlay
          v-for="item in items"
          :key="item.id"
          :button-theme="buttonTheme"
          class="av-w-full"
          @delete="$emit('delete', item.id)"
        >
          <slot
            name="item"
            :item="item"
          />
        </DeleteOverlay>
      </div>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.selected-associate-items-container__list {
  overflow-y: auto;
}
</style>
