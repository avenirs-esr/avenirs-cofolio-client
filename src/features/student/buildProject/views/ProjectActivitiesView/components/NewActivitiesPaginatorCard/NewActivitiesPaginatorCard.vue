<script lang="ts" setup>
import type { PageInfoDTO } from '@/api/avenir-esr'
import { AvCard, AvIconText, AvPagination, getPaginationPages, IX_ICONS, PageSizes } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentPage = ref(0)

const pageInfo = ref<PageInfoDTO>({
  page: currentPage.value,
  pageSize: PageSizes.FOUR,
  totalElements: 8,
  totalPages: 2
}) // TODO US #959 - get paginated data from back

const totalPages = computed(() => pageInfo.value.totalPages)
const pages = computed(() => getPaginationPages(totalPages))
</script>

<template>
  <AvCard
    border-color="var(--stroke)"
    background-color="var(--card)"
    title-background="var(--card)"
    collapsible
    data-testid="new-activities-paginator-card"
  >
    <template #title>
      <AvIconText
        :icon="IX_ICONS.LIBRARY_NEW"
        icon-color="var(--text2)"
        :text="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.newActivitiesPaginatorCard.title', { count: pageInfo.totalElements })"
        text-color="var(--text1)"
        typography-class="n5"
        data-testid="new-activities-paginator-card-title"
      />
    </template>

    <div class="av-col av-gap-sm">
      <div class="av-row av-justify-end">
        <AvPagination
          :aria-label="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.newActivitiesPaginatorCard.pagination.ariaLabel')"
          :current-page="pageInfo.page"
          :pages="pages"
          compact
          :prev-page-label="t('global.avPagination.prevPageTitle')"
          :next-page-label="t('global.avPagination.nextPageTitle')"
          :compact-current-page-label="t('global.avPagination.current', {
            current: (pageInfo.page + 1),
            total: (pageInfo.totalPages),
          })"
          @update:current-page="(page) => currentPage = page"
        />
      </div>
    </div>
  </AvCard>
</template>
