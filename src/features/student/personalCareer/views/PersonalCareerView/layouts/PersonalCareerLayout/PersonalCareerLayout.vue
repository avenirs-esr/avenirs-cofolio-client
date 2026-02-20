<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { AvSideNavigation, type AvSideNavigationItem, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

const isDemoMode = __DEMO_MODE__
const selectedItem = computed<{ itemId: string }>(() => ({ itemId: route.name as string }))
const items = computed<AvSideNavigationItem[]>(() => {
  const allItems = [
    {
      id: ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER.name,
      label: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'),
      icon: ICONS_DATA_URL.TEXT_BULLET_LIST_SPARKLE,
    },
    {
      id: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
      label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.title'),
      icon: MDI_ICONS.SCHOOL_OUTLINE,
      demo: true
    },
    {
      id: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
      label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.title'),
      icon: MDI_ICONS.HUB_OUTLINE,
      demo: true
    }
  ]
  return isDemoMode ? allItems.filter(item => item.demo) : allItems
})

function navigateToSelectedItem (item: { itemId: string }) {
  router.push({ name: item.itemId })
}
</script>

<template>
  <div class="student-project-personal-career-container av-row av-w-full">
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      :selected-item="selectedItem"
      :items="items"
      @update:selected-item="navigateToSelectedItem"
    />
    <div class="student-project-personal-career-container__content av-col av-flex-fill av-p-lg">
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
