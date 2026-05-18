<script lang="ts" setup>
import { EActivityThematic, type GetActivitiesViewParams, useGetActivitiesView } from '@/api/avenir-esr'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { usePagination } from '@/common/composables'
import ActivityCard from '@/features/student/buildProject/components/cards/ActivityCard/ActivityCard.vue'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import { AvIconText, AvTagPicker, type AvTagPickerOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activitiesStore = useProjectActivitiesStore()

const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(activitiesStore, 'currentPage'), toRef(activitiesStore, 'pageSizeSelected'))

const selectedThematic = ref<EActivityThematic | undefined>(undefined)

function onSelectThematic (thematic: AvTagPickerOption) {
  if (selectedThematic.value !== thematic.value) {
    currentPage.value = 0
  }
  selectedThematic.value = thematic.value === 'all' ? undefined : thematic.value as EActivityThematic
}

const params = computed<GetActivitiesViewParams>(() => ({
  thematic: selectedThematic.value as GetActivitiesViewParams['thematic'],
  page: currentPage.value,
  pageSize: pageSizeSelected.value
}))

const { data, error, isFetching } = useGetActivitiesView(params)
const activities = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)

const filterOptions: AvTagPickerOption[] = Object.values(EActivityThematic).map(thematic => ({
  label: t(`global.activities.badges.thematics.${thematic}`),
  value: thematic
}))
const allThematicsOption = { label: t('student.buildProject.activities.AllActivitiesSection.buttons.all'), value: 'all' }
filterOptions.push(allThematicsOption)
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="all-activities-section"
  >
    <AvIconText
      :icon="MDI_ICONS.STOREFRONT_OUTLINE"
      icon-color="var(--icon)"
      :text="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.allActivitiesSection.title', { count: pageInfo?.totalElements ?? 0 })"
      text-color="var(--text1)"
      typography-class="n5"
      data-testid="all-activities-section-title"
    />
    <div
      class="av-row av-gap-sm av-wrap"
    >
      <AvTagPicker
        class="av-w-full av-wrap"
        :options="filterOptions"
        :selected="allThematicsOption"
        :handle-select-change="onSelectThematic"
      />
    </div>
    <QuerySuspense
      :error="error"
      :is-loading="isFetching"
      :is-empty="activities.length === 0"
    >
      <template #error>
        <ActivityErrorMessage :error="error" />
      </template>
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div
          v-if="activities.length > 0"
          class="av-row av-align-center av-gap-sm av-wrap"
          data-testid="cards-layout"
        >
          <ActivityCard
            v-for="activity in activities"
            :key="activity.id"
            :activity="activity"
          />
        </div>
        <div
          v-else
          class="av-pb-5xl"
          data-testid="empty-cards"
        >
          <span class="b2-regular">
            {{ t('student.buildProject.activities.AllActivitiesSection.noActivitiesFound') }}
          </span>
        </div>
      </Pagination>
    </QuerySuspense>
  </div>
</template>
