<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants/route-names'
import DeclaredExperienceSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import DeclaredExperienceDetailsDropdown
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.global.navigation.tabs.project.items.declaredExperience') }
])
</script>

<template>
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div class="declared-experience-update-view av-row av-gap-sm">
    <DeclaredExperienceSideMenu />
    <div class="av-col av-flex-fill av-gap-md">
      <div class="declared-experience-details-container__title av-row--lg av-align-start--lg av-justify-between--lg">
        <span class="n4">title</span>
        <DeclaredExperienceDetailsDropdown />
      </div>
      <p>declared experience details container placeholder</p>
    </div>
  </div>
</template>
