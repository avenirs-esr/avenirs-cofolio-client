<script setup lang="ts">
import SideNavigation from '@/common/components/navigation/SideNavigation/SideNavigation.vue'
import { useScrollSpy } from '@/common/composables/use-scroll-spy/use-scroll-spy'
import { scrollToElement } from '@/common/utils/scroll/scroll-to-element'
import { ContentSectionId, EditActivityTabIndex, PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import { type AvSideNavigationMenuItem, type AvSideNavigationSelectedItem, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<AddNationalActivitySideNavigationProps>()
const { activeTab } = toRefs(props)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

interface AddNationalActivitySideNavigationProps {
  activeTab: EditActivityTabIndex
}
const { activeElementId } = useScrollSpy([
  ContentSectionId.TITLE,
  ContentSectionId.THEMATIC,
  ContentSectionId.INSTRUCTIONS,
  ContentSectionId.CONTEXT,
  ContentSectionId.DOCUMENTS,
  ContentSectionId.SCHEDULE,
  ContentSectionId.MODALITIES
])

const isManualNavigation = ref(false)
const isSideMenuCollapsed = ref<boolean>(false)
const selectedItem = ref<AvSideNavigationSelectedItem>({ itemId: '' })

const contentItems = computed<AvSideNavigationMenuItem[]>(() => [
  {
    id: 'CONTENT',
    label: t('staff.activities.views.AddNationalActivityView.sideNavigation.contentHeader'),
    icon: MDI_ICONS.PENCIL_OUTLINE,
    expanded: true,
    children: Object.values(ContentSectionId).map(id => ({
      id,
      label: t(`global.activities.contentSectionTypes.${id}`),
    })),
  },
])

const publicationItems = computed<AvSideNavigationMenuItem[]>(() => [
  {
    id: 'PUBLICATION',
    label: t('staff.activities.views.AddNationalActivityView.sideNavigation.publicationHeader'),
    icon: RI_ICONS.SEND_PLANE_LINE,
    expanded: true,
    children: Object.values(PublicationSectionId).map(id => ({
      id,
      label: t(`staff.activities.views.AddNationalActivityView.sideNavigation.publication.${id}`),
    })),
  },
])

const items = computed<AvSideNavigationMenuItem[]>(() => {
  return activeTab.value === EditActivityTabIndex.PUBLICATION ? publicationItems.value : contentItems.value
})

function navigateToSelectedItem (item: AvSideNavigationSelectedItem) {
  isManualNavigation.value = true
  selectedItem.value = item

  router.replace({
    query: route.query,
    hash: `#${item.itemId}`,
  })

  scrollToElement(item.itemId)

  window.setTimeout(() => {
    isManualNavigation.value = false
  }, 500)
}

watch(activeElementId, () => {
  if (!isManualNavigation.value) {
    selectedItem.value = { itemId: activeElementId.value ?? '' }
  }
})

watch(activeTab, (newValue) => {
  requestAnimationFrame(() => {
    const itemId = newValue === EditActivityTabIndex.PUBLICATION ? publicationItems.value[0].id : contentItems.value[0].id
    selectedItem.value = { itemId }

    router.replace({
      query: route.query,
      path: route.path,
    })
  })
}, { immediate: true })
</script>

<template>
  <SideNavigation
    v-model:selected-item="selectedItem"
    v-model:is-side-menu-collapsed="isSideMenuCollapsed"
    hide-content-when-collapsed
    :items="items"
    sticky
    data-testid="add-national-activity-side-navigation"
    @update:selected-item="navigateToSelectedItem"
  />
</template>

<style lang="scss" scoped>
:deep(.av-side-menu__content) {
  max-width: var(--dimension-7xl) !important;
}
</style>
