<script setup lang="ts">
import SideNavigation from '@/common/components/navigation/SideNavigation/SideNavigation.vue'
import { ICONS, ROUTES } from '@/common/constants'
import {
  AvSelect,
  type AvSelectOption,
  type AvSelectSelectedOption,
  type AvSideNavigationItem,
  useAvBreakpoints
} from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  selectedItem: [itemLabel: string]
}>()

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)
const route = useRoute()
const router = useRouter()
const { isMobile } = useAvBreakpoints()

const selectedItem = computed<{ itemId: string }>(() => ({ itemId: route.name as string }))
const items = computed<AvSideNavigationItem[]>(() => [
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
    label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.title'),
    icon: ICONS.PROGRAMS,
  },
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
    label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.title'),
    icon: ICONS.EXPERIENCES,
  }
])

const selectOptions = computed<AvSelectOption[]>(() =>
  items.value.map(item => ({
    id: item.id,
    label: item.label,
  })),
)

function navigateToSelectedItem (item: { itemId: string }) {
  router.replace({ name: item.itemId })
}

function onSelectChange (value: AvSelectSelectedOption) {
  navigateToSelectedItem({ itemId: value.itemId })
}

watch(() => route.name, (newRouteName) => {
  if (newRouteName) {
    const matchingItem = items.value.find(item => item.id === newRouteName)
    if (matchingItem) {
      emit('selectedItem', matchingItem.label)
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="student-project-personal-career-container av-col av-row--md av-w-full">
    <AvSelect
      v-if="isMobile"
      :selected-item="selectedItem"
      :options="selectOptions"
      placeholder=""
      data-testid="section-navigation-select-navigation"
      @update:selected-item="onSelectChange"
    />
    <SideNavigation
      v-else
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      :selected-item="selectedItem"
      :items="items"
      data-testid="section-navigation-side-navigation"
      @update:selected-item="navigateToSelectedItem"
    />
    <div class="student-project-personal-career-container__content av-col av-flex-fill av-p-lg--md av-pt-lg">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-project-personal-career-container {
  min-height: calc(100vh - 28.15rem);

  &__content {
    h2 {
      margin-bottom: var(--spacing-md);
    }
  }
}
</style>
