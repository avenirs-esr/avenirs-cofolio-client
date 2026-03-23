<script lang="ts" setup>
import type { IdTitle } from '@/types'
import { AvCheckboxListItem, AvList, formatTextToHtml } from '@avenirs-esr/avenirs-dsav'

/**
 * @example
 * // -- SCRIPT PART --
 * const results = computed(() => [
 *   {
 *     id: '1',
 *     title: 'Result 1',
 *     formattedTitle: '**Resu**lt 1',
 *     description: 'Description for result 1',
 *   },
 *   {
 *     id: '2',
 *     title: 'Result 2',
 *     formattedTitle: '**Resu**lt 2',
 *     description: 'Description for result 2',
 *   },
 *   {
 *     id: '3',
 *     title: 'Result 3 with a very long text that should be truncated if it goes above 2 lines',
 *     formattedTitle: '**Resu**lt 3 with a very long text that should be truncated if it goes above 2 lines',
 *     description: 'Description for result 3',
 *   },
 * ])
 *
 * // -- TEMPLATE PART --
 * <CheckboxResultList
 *   :results="results"
 *   height="100px"
 *   width="300px"
 *   :max-lines="1"
 * />
 */
export interface CheckBoxResultListProps {
  results: (IdTitle & { formattedTitle?: string })[]
  height?: string
  width?: string
  maxLines?: number
}

const { height = 'auto', width = 'auto', maxLines = 1 } = defineProps<CheckBoxResultListProps>()

const selectedItems = defineModel<string[]>({ default: [] })

const LIST_ID = 'checkbox-result-list'
</script>

<template>
  <div class="checkbox-result-list">
    <AvList
      background-color="var(--dialog)"
      bordered
      border-color="var(--stroke)"
      border-radius="var(--radius-lg)"
      size="xsmall"
      class="checkbox-result-list__list"
    >
      <AvCheckboxListItem
        v-for="result in results"
        :id="result.id"
        :key="result.id"
        v-model="selectedItems"
        :list-id="LIST_ID"
        :aria-label="result.title"
      >
        <div class="av-col">
          <span
            v-if="result.formattedTitle"
            class="text-clamp caption-regular"
            v-html="formatTextToHtml(result.formattedTitle, 'var(--dark-background-primary1)')"
          />
          <span
            v-else
            class="text-clamp caption-regular"
          >
            {{ result.title }}
          </span>
          <span
            v-if="result.description"
            class="text-clamp caption-light"
          >
            {{ result.description }}
          </span>
        </div>
      </AvCheckboxListItem>
    </AvList>
  </div>
</template>

<style lang="scss" scoped>
.checkbox-result-list {
  height: v-bind(height);
  width: v-bind(width);

  &__list {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .text-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: v-bind(maxLines);
    -webkit-line-clamp: v-bind(maxLines);
    overflow: hidden;
  }
}
</style>
