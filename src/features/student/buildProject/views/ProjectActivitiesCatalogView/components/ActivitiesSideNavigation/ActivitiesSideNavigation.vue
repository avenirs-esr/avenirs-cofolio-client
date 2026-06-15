<script setup lang="ts">
import { EActivityThematic, useGetActivityNavigation } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import SideNavigation from '@/common/components/navigation/SideNavigation/SideNavigation.vue'
import { useNavigation } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { isEnumMember } from '@/common/utils'
import { type AvSideNavigationMenuItem, type AvSideNavigationSelectedItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { navigateToStudentProjectActivitiesCatalog } = useNavigation()

const isSideMenuCollapsed = ref(false)
const { data: activitiesRef, isLoading, isError } = useGetActivityNavigation()

const DEFAULT_PARENT_ICON = MDI_ICONS.BOOK_OPEN_VARIANT
const CHILD_ICON = ICONS.ACTIVITY

function getThematicLabel (title: string) {
  return isEnumMember(EActivityThematic, title) ? t(`global.activities.badges.thematics.${title}`) : title
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

const routeId = computed(() => typeof route.params.id === 'string' ? route.params.id : undefined)

const routeThematic = computed(() => typeof route.params.thematic === 'string' ? route.params.thematic : undefined)

const selectedSideNavItem = ref<AvSideNavigationSelectedItem>({
  itemId: routeId.value ?? items.value?.[0]?.children?.[0]?.id ?? '',
  parentId: routeThematic.value ?? items.value?.[0]?.id ?? undefined,
})

watch([routeId, routeThematic, items], ([id, thematic, sideNavItems]) => {
  selectedSideNavItem.value = {
    itemId: id ?? sideNavItems?.[0]?.children?.[0]?.id ?? '',
    parentId: thematic ?? sideNavItems?.[0]?.id ?? undefined,
  }
}, { immediate: true })

function navigateToSelectedItem (value: AvSideNavigationSelectedItem) {
  selectedSideNavItem.value = value

  const id = value.itemId
  const thematic = value.parentId

  if (!thematic || !id || !isEnumMember(EActivityThematic, thematic)) {
    return
  }

  if (routeThematic.value === thematic && routeId.value === id) {
    return
  }

  navigateToStudentProjectActivitiesCatalog({
    thematic,
    id,
    replace: true,
  })
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <SideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      data-testid="activities-side-navigation"
      :selected-item="selectedSideNavItem"
      :items="items"
      width="15rem"
      @update:selected-item="navigateToSelectedItem"
    />
  </Loader>
</template>
