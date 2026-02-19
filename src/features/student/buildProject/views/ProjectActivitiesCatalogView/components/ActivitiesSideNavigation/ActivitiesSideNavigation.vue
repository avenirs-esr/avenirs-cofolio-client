<script setup lang="ts">
import { EActivityThematic } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import { useNavigation } from '@/common/composables'
import { useActivitiesNavigationQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { ICONS } from '@/features/student/global/icons'
import {
  AvSideNavigation,
  type AvSideNavigationMenuItem,
  type AvSideNavigationSelectedItem,
  MDI_ICONS,
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { navigateToStudentProjectActivitiesCatalog } = useNavigation()

const isSideMenuCollapsed = ref(false)
const { activities: activitiesRef, isLoading, isError } = useActivitiesNavigationQuery()

const DEFAULT_PARENT_ICON = MDI_ICONS.BOOK_OPEN_VARIANT
const CHILD_ICON = MDI_ICONS.TARGET_ARROW

function isEActivityThematic (value: string): value is EActivityThematic {
  return Object.values(EActivityThematic).includes(value as EActivityThematic)
}

function getThematicLabel (title: string) {
  return isEActivityThematic(title) ? t(`student.buildProject.activities.thematics.${title}`) : title
}

function getThematicIcon (title: string) {
  return ICONS[title as keyof typeof ICONS] ?? DEFAULT_PARENT_ICON
}

const items = computed<AvSideNavigationMenuItem[]>(() => {
  const activities = activitiesRef.value ?? []

  return activities
    .map((activity) => {
      const thematicTitle = activity.title

      return {
        id: thematicTitle,
        label: getThematicLabel(thematicTitle),
        icon: getThematicIcon(thematicTitle),
        children: (activity.items ?? []).map(item => ({
          id: item.id,
          label: item.title,
          icon: CHILD_ICON,
        })),
      } satisfies AvSideNavigationMenuItem
    })
})

const routeId = computed(() =>
  typeof route.params.id === 'string'
    ? route.params.id
    : Array.isArray(route.params.id)
      ? route.params.id[0]
      : undefined
)

const routeThematic = computed(() =>
  typeof route.params.thematic === 'string'
    ? route.params.thematic
    : Array.isArray(route.params.thematic)
      ? route.params.thematic[0]
      : undefined
)

const selectedSideNavItem = ref<AvSideNavigationSelectedItem>({
  itemId: routeId.value ?? items.value?.[0]?.children?.[0]?.id ?? '',
  parentId: routeThematic.value ?? items.value?.[0]?.id ?? undefined,
})

function navigateToSelectedItem (value: AvSideNavigationSelectedItem) {
  selectedSideNavItem.value = value

  const id = value.itemId
  const theme = value.parentId

  if (!theme || !id || !isEActivityThematic(theme)) {
    return
  }

  navigateToStudentProjectActivitiesCatalog({ theme, id })
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      :selected-item="selectedSideNavItem"
      :items="items"
      @update:selected-item="navigateToSelectedItem"
    />
  </Loader>
</template>
