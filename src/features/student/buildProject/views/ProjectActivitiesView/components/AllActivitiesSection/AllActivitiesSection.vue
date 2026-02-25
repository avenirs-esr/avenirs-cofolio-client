<script lang="ts" setup>
import { EActivityThematic } from '@/api/avenir-esr'
import { Loader } from '@/common/components'
import Pagination from '@/common/components/Pagination/Pagination.vue'
import { usePagination } from '@/common/composables'
import ActivityCard from '@/features/student/buildProject/components/cards/ActivityCard/ActivityCard.vue'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useActivitiesViewQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
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
  selectedThematic.value = thematic.value === 'all' ? undefined : thematic.value as EActivityThematic
}

const { activities, pageInfo, error, isFetching, isError } = useActivitiesViewQuery({ thematic: selectedThematic, page: currentPage, pageSize: pageSizeSelected })

const filterOptions: AvTagPickerOption[] = Object.values(EActivityThematic).map(thematic => ({ label: t(`student.buildProject.activities.thematics.${thematic}`), value: thematic }))
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
      :text="t('student.buildProject.views.projectActivitiesView.allActivitiesTab.allActivitiesSection.title', { count: pageInfo.totalElements })"
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
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <ActivityErrorMessage :error />
      <Loader
        :is-loading="isFetching && !isError"
        size="2xl"
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
      </Loader>
    </Pagination>
  </div>
</template>
