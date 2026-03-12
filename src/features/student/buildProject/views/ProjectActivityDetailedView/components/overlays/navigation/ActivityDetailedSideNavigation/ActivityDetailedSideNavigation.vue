<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import { ICONS } from '@/features/student/global/icons'
import {
  AvSideNavigation,
  type AvSideNavigationMenuItem,
  type AvSideNavigationSelectedItem,
  MS_ICONS,
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type ActivityDetailedSection = 'activity-detailed' | 'my-perspective'

export interface ActivityDetailedSideNavigationProps {
  activityTitle?: string
  selectedItem?: AvSideNavigationSelectedItem
}

const props = withDefaults(defineProps<ActivityDetailedSideNavigationProps>(), {
  activityTitle: '',
  selectedItem: () => ({ itemId: 'activity-detailed' }),
})

const emit = defineEmits<{
  (e: 'update:selectedItem', value: AvSideNavigationSelectedItem): void
}>()

const { t } = useI18n()

const isSideMenuCollapsed = ref(false)

const items = computed<AvSideNavigationMenuItem[]>(() => [
  {
    id: 'activity-detailed',
    label: props.activityTitle || t('global.detail'),
    icon: ICONS.ACTIVITY,
  },
  {
    id: 'my-perspective',
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedSideNavigation.myPerspective'),
    icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
  },
])
</script>

<template>
  <Loader
    :is-loading="false"
    size="2xl"
  >
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      :selected-item="selectedItem"
      :items="items"
      data-testid="activity-detailed-side-navigation"
      @update:selected-item="emit('update:selectedItem', $event)"
    />
  </Loader>
</template>
