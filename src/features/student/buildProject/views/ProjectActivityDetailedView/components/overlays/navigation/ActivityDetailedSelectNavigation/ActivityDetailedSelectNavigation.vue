<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import {
  ACTIVITY_DETAILED_SECTIONS
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.constants'
import {
  AvSelect,
  type AvSelectOption,
  type AvSelectSelectedOption,
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityDetailedSelectNavigationProps {
  activityTitle?: string
  selectedItem?: AvSelectSelectedOption
}

const { activityTitle = '', selectedItem = { itemId: 'activity-detailed' } } = defineProps<ActivityDetailedSelectNavigationProps>()

const emit = defineEmits<{
  (e: 'update:selectedItem', value: AvSelectSelectedOption): void
}>()

const { t } = useI18n()

const selectOptions = computed<AvSelectOption[]>(() => [
  {
    id: ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
    label: activityTitle || t('global.detail'),
  },
  {
    id: ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedSideNavigation.myPerspective'),
  },
])

function onSelectChange (value: AvSelectSelectedOption) {
  emit('update:selectedItem', value)
}
</script>

<template>
  <Loader
    :is-loading="false"
    size="2xl"
  >
    <AvSelect
      data-testid="activity-detailed-select-navigation"
      :selected-item="selectedItem"
      :options="selectOptions"
      :placeholder="t('student.global.navigation.selects.label')"
      :label="t('student.global.navigation.selects.label')"
      @update:selected-item="onSelectChange"
    />
  </Loader>
</template>
