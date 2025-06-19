<!-- This code is an adaptation of the source code of DsfrPagination available at:
 https://vue-ds.fr/composants/DsfrPagination -->

<script lang="ts" setup>
import type { DsfrPaginationProps, Page } from '@gouvminint/vue-dsfr'
import { AvVIcon } from '@/ui/base'
import { MDI_ICONS } from '@/ui/tokens'
import { useI18n } from 'vue-i18n'

const {
  compact = false,
  truncLimit = 2,
  currentPage = 0,
  firstPageTitle,
  lastPageTitle,
  nextPageTitle,
  prevPageTitle,
  ariaLabel,
  pages,
} = defineProps<{ compact?: boolean } & DsfrPaginationProps>()

const emit = defineEmits<{ (e: 'update:current-page', payload: number): void }>()

const { t } = useI18n()

const renderedFirstPageTitle = computed(() => firstPageTitle ?? t('global.avPagination.firstPageTitle'))
const renderedLastPageTitle = computed(() => lastPageTitle ?? t('global.avPagination.lastPageTitle'))
const renderedNextPageTitle = computed(() => nextPageTitle ?? t('global.avPagination.nextPageTitle'))
const renderedPrevPageTitle = computed(() => prevPageTitle ?? t('global.avPagination.prevPageTitle'))
const renderedAriaLabel = computed(() => ariaLabel ?? t('global.avPagination.ariaLabel'))
const renderedCompactCurrentPage = computed(() => t('global.avPagination.current', { current: currentPage + 1, total: pages.length }))

const startIndex = computed(() => {
  return Math.min(pages.length - 1 - truncLimit, Math.max(currentPage - (truncLimit - truncLimit % 2) / 2, 0))
})
const endIndex = computed(() => {
  return Math.min(pages.length - 1, startIndex.value + truncLimit)
})
const displayedPages = computed(() => {
  return pages.length > truncLimit ? pages.slice(startIndex.value, endIndex.value + 1) : pages
})

const updatePage = (index: number) => emit('update:current-page', index)
const toPage = (index: number) => updatePage(index)
const tofirstPage = () => toPage(0)
const toPreviousPage = () => toPage(Math.max(0, currentPage - 1))
const toNextPage = () => toPage(Math.min(pages.length - 1, currentPage + 1))
const toLastPage = () => toPage(pages.length - 1)
const isCurrentPage = (page: Page) => pages.indexOf(page) === currentPage
</script>

<template>
  <nav
    role="navigation"
    class="fr-pagination"
    :aria-label="renderedAriaLabel"
  >
    <ul class="fr-pagination__list">
      <li v-if="compact">
        <span class="b2-regular">
          {{ renderedCompactCurrentPage }}
        </span>
      </li>
      <li>
        <a
          v-if="!compact"
          :href="pages[0]?.href"
          class="fr-pagination__link"
          :title="renderedFirstPageTitle"
          :aria-disabled="currentPage === 0 ? true : undefined"
          @click.prevent="tofirstPage()"
        >
          <AvVIcon
            :name="MDI_ICONS.PAGE_FIRST"
            :size="1.5"
            :color="currentPage === 0 ? 'var(--dark-background-neutral)' : 'var(--dark-background-primary1)'"
          />
          <span class="fr-sr-only">{{ renderedFirstPageTitle }}</span>
        </a>
      </li>
      <li>
        <a
          :href="pages[Math.max(currentPage - 1, 0)]?.href"
          class="fr-pagination__link fr-pagination__link--lg-label"
          :title="renderedPrevPageTitle"
          :aria-disabled="currentPage === 0 ? true : undefined"
          @click.prevent="toPreviousPage()"
        >
          <AvVIcon
            :name="MDI_ICONS.NAVIGATE_BEFORE"
            :size="1.5"
            :color="currentPage === 0 ? 'var(--dark-background-neutral)' : 'var(--dark-background-primary1)'"
          />
          <span
            v-if="!compact"
            class="caption-regular fr-hidden fr-unhidden-md"
          >{{ renderedPrevPageTitle }}</span>
        </a>
      </li>
      <template v-if="!compact">
        <li
          v-for="(page, idx) in displayedPages"
          :key="idx"
        >
          <a
            :href="page?.href"
            class="fr-pagination__link fr-unhidden-lg"
            :title="page.title"
            :aria-current="isCurrentPage(page) ? 'page' : undefined"
            @click.prevent="toPage(pages.indexOf(page))"
          >
            <span v-if="displayedPages.indexOf(page) === 0 && startIndex > 0 ">...</span>
            {{ page.label }}
            <span v-if="displayedPages.indexOf(page) === displayedPages.length - 1 && endIndex < pages.length - 1">...</span>
          </a>
        </li>
      </template>
      <li>
        <a
          :href="pages[Math.min(currentPage + 1, pages.length - 1)]?.href"
          class="fr-pagination__link fr-pagination__link--lg-label"
          :title="renderedNextPageTitle"
          :disabled="currentPage === pages.length - 1 ? true : undefined"
          :aria-disabled="currentPage === pages.length - 1 ? true : undefined"
          @click.prevent="toNextPage()"
        >
          <span
            v-if="!compact"
            class="caption-regular fr-hidden fr-unhidden-md"
          >{{ renderedNextPageTitle }}</span>
          <AvVIcon
            :name="MDI_ICONS.NAVIGATE_NEXT"
            :size="1.5"
            :color="currentPage === pages.length - 1 ? 'var(--dark-background-neutral)' : 'var(--dark-background-primary1)'"
          />
        </a>
      </li>
      <li>
        <a
          v-if="!compact"
          class="fr-pagination__link"
          :href="pages.at(-1)?.href"
          :title="renderedLastPageTitle"
          :disabled="currentPage === pages.length - 1 ? true : undefined"
          :aria-disabled="currentPage === pages.length - 1 ? true : undefined"
          @click.prevent="toLastPage()"
        >
          <span class="fr-sr-only">{{ renderedLastPageTitle }}</span>
          <AvVIcon
            :name="MDI_ICONS.PAGE_LAST"
            :size="1.5"
            :color="currentPage === pages.length - 1 ? 'var(--dark-background-neutral)' : 'var(--dark-background-primary1)'"
          />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.fr-pagination__list {
  gap: 1rem;
}

.fr-pagination__link {
  display: flex;
  margin: 0;
  border-radius: 0.75rem;
  text-align: center !important;
  vertical-align: middle;
  gap: 0.75rem;
}

a::before,
a::after {
  content: none !important;
  display: none !important;
}

.fr-pagination__link[aria-disabled="true"] {
  pointer-events: none !important;
  cursor: not-allowed !important;
}

.fr-pagination__link:hover,
.fr-pagination__link:hover * {
  background-color: var(--dark-background-primary1) !important;
  color: white !important;
}
</style>
