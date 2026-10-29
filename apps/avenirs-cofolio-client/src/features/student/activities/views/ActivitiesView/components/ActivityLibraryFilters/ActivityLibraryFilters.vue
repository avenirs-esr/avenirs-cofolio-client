<script setup lang="ts">
import type { EActivityThematic } from '@/api/avenir-esr'
import type { SortValue } from '@/common/types'
import type { DeclaredActivityFilters } from '@/features/student/activities/types/declared-activities.types'
import { AvButton, AvModal, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { EDeclaredActivityStatus, ESortField, ESortOrder } from '@/api/avenir-esr'
import ActivityThematicSelect from '@/common/activities/inputs/ActivityThematicSelect/ActivityThematicSelect.vue'
import DeclaredActivityStatusSelect from '@/common/activities/inputs/DeclaredActivityStatusSelect/DeclaredActivityStatusSelect.vue'
import { SortSelect } from '@/common/components'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import { useModal } from '@/common/composables'
import { formatSortValue, parseSortValue } from '@/common/utils/http/http-params'

const emit = defineEmits<{
  (e: 'update:filters', filters: DeclaredActivityFilters): void
}>()

const { t } = useI18n()
const { modalOpened, openModal, closeModal } = useModal()
const { isMobile } = useAvBreakpoints()

const FILTERABLE_STATUSES = Object.values(EDeclaredActivityStatus)
  .filter(status => status !== EDeclaredActivityStatus.CONSULTED)

const keyword = ref('')
const selectedThematics = ref<EActivityThematic[]>([])
const selectedStatuses = ref<EDeclaredActivityStatus[]>([])
const selectedSort = ref<{ itemId: SortValue }>({ itemId: formatSortValue(ESortField.DATE, ESortOrder.DESC) })

const thematics = computed(() =>
  selectedThematics.value.length
    ? selectedThematics.value
    : undefined
)
const statuses = computed(() => {
  if (!selectedStatuses.value.length) {
    return undefined
  }

  return selectedStatuses.value.flatMap(status =>
    status === EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT
      ? [status, EDeclaredActivityStatus.CONSULTED]
      : status
  )
})

const filters = computed<DeclaredActivityFilters>(() => ({
  keyword: keyword.value || undefined,
  thematics: thematics.value,
  statuses: statuses.value,
  ...parseSortValue(selectedSort.value.itemId),
}))

const debouncedEmit = debounce((payload: DeclaredActivityFilters) => {
  emit('update:filters', payload)
}, 350)

function resetAllFilters () {
  keyword.value = ''
  selectedThematics.value = []
  selectedStatuses.value = []
}

watch(filters, debouncedEmit)
</script>

<template>
  <AvButton
    v-if="isMobile"
    :label="t('student.activities.views.ActivitiesView.ActivityLibraryTab.ActivityLibraryFilters.filter')"
    :icon="MDI_ICONS.FILTER_OUTLINE"
    variant="OUTLINED"
    data-testid="activity-library-filters-mobile-open-button"
    @click="openModal"
  />

  <component
    :is="isMobile ? AvModal : 'div'"
    v-bind="isMobile ? {
      opened: modalOpened,
      closeButtonLabel: t('global.buttons.close'),
    } : {}"
    @close="closeModal"
  >
    <div class="av-row av-wrap av-gap-xs av-align-end av-px-xs">
      <SearchEntityInput
        v-model="keyword"
        :entity-name="t('student.activities.views.ActivitiesView.ActivityLibraryTab.ActivityLibraryFilters.search.entityName')"
        :entity-placeholder="t('student.activities.views.ActivitiesView.ActivityLibraryTab.ActivityLibraryFilters.search.entityPlaceholder')"
      />

      <ActivityThematicSelect
        v-model="selectedThematics"
        multiple
      />

      <DeclaredActivityStatusSelect
        v-model="selectedStatuses"
        :statuses="FILTERABLE_STATUSES"
      />

      <SortSelect v-model:selected-item="selectedSort" />

      <AvButton
        class="reset-button"
        :label="t('student.activities.views.ActivitiesView.ActivityLibraryTab.ActivityLibraryFilters.reset')"
        :icon="MDI_ICONS.REFRESH"
        variant="OUTLINED"
        size="LG"
        data-testid="activity-library-filters-reset-button"
        @click="resetAllFilters"
      />
    </div>
  </component>
</template>

<style scoped lang="scss">
:deep(input) {
  line-height: unset !important;
  height: var(--dimension-xl);
}

.reset-button {
  height: var(--dimension-xl);
}
</style>
