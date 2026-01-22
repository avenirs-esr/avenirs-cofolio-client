<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { AvSideNavigation, type AvSideNavigationItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

const selectedItem = computed<string>(() => route.name as string)

const items = computed<AvSideNavigationItem[]>(() => [
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER.name,
    label: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'),
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
  },
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS.name,
    label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.title'),
    icon: MDI_ICONS.SCHOOL_OUTLINE
  },
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES.name,
    label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.title'),
    icon: MDI_ICONS.VECTOR_POLYGON_VARIANT
  },
  {
    id: ROUTES.STUDENT.PERSONAL_CAREER_ACTIVITIES.name,
    label: t('student.personalCareer.views.PersonalCareerView.ActivitiesSection.title'),
    icon: MDI_ICONS.TARGET_ARROW
  }
])

function navigateToSelectedItem (routeName: string) {
  router.push({ name: routeName })
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
