<script setup lang="ts">
import type { ActivitiesNavigationMap } from '@/features/student/buildProject/types/activities.types'
import {
  type ActivityItemNavigationDTO,
  EActivityThematic,
} from '@/api/avenir-esr'
import { useActivitiesNavigationQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { AvSideNavigation, type AvSideNavigationMenuItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isSideMenuCollapsed = ref(false)
const selectedItem = ref('')

const { activities: activitiesRef } = useActivitiesNavigationQuery()

const DEFAULT_PARENT_ICON = MDI_ICONS.BOOK_OPEN_VARIANT
const CHILD_ICON = MDI_ICONS.TARGET_ARROW

const THEMATIC_META = computed<Record<EActivityThematic, { label: string, icon: string }>>(() => ({
  [EActivityThematic.ABOUT_ME]: {
    label: t('student.buildProject.activities.thematics.aboutMe'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.FUTURE_PLANS]: {
    label: t('student.buildProject.activities.thematics.futurePlans'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.PROGRAMS]: {
    label: t('student.buildProject.activities.thematics.programs'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.EXPERIENCES]: {
    label: t('student.buildProject.activities.thematics.experiences'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.TRAJECTORIES]: {
    label: t('student.buildProject.activities.thematics.trajectories'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.CV]: {
    label: t('student.buildProject.activities.thematics.cv'),
    icon: DEFAULT_PARENT_ICON,
  },
  [EActivityThematic.TRANSVERSAL]: {
    label: t('student.buildProject.activities.thematics.transversal'),
    icon: DEFAULT_PARENT_ICON,
  },
}))

function isEActivityThematic (value: string): value is EActivityThematic {
  return Object.values(EActivityThematic).includes(value as EActivityThematic)
}

function mapActivitiesToSideNavItems (
  activities?: ActivitiesNavigationMap
): AvSideNavigationMenuItem[] {
  if (!activities) {
    return []
  }

  return Object.entries(activities)
    .filter(([, list]) => Array.isArray(list) && list.length > 0)
    .map(([key, list], index) => {
      const thematic = isEActivityThematic(key) ? key : null

      const children = (list ?? []).map((a: ActivityItemNavigationDTO) => ({
        id: a.id,
        label: a.title,
        icon: CHILD_ICON,
      }))

      return {
        id: key,
        label: thematic ? THEMATIC_META.value[thematic].label : key,
        icon: thematic ? THEMATIC_META.value[thematic].icon : DEFAULT_PARENT_ICON,
        expanded: index === 0,
        children,
      } satisfies AvSideNavigationMenuItem
    })
}

const items = computed<AvSideNavigationMenuItem[]>(() =>
  mapActivitiesToSideNavItems(activitiesRef.value)
)

watchEffect(() => {
  if (selectedItem.value) {
    return
  }
  const firstChild = items.value[0]?.children?.[0]
  if (firstChild) {
    selectedItem.value = firstChild.id
  }
})

function navigateToSelectedItem (itemId: string) {
  selectedItem.value = itemId
}
</script>

<template>
  <AvSideNavigation
    v-model:is-side-menu-collapsed="isSideMenuCollapsed"
    v-model:selected-item="selectedItem"
    :items="items"
    @update:selected-item="navigateToSelectedItem"
  />
</template>
