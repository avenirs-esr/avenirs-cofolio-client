<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants/route-names'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { useDeclaredExperienceDetailedViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { AvCancelConfirmButtons, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const experienceId = computed(() => String(route.params.id ?? ''))

const { t } = useI18n()
const { navigateToStudentDeclaredExperience } = useNavigation()
const { declaredExperience } = useDeclaredExperienceDetailedViewQuery({ experienceId })

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.personalCareer.views.PersonalCareerView.MyCareerSection.title'), to: ROUTES.STUDENT.PERSONAL_CAREER },
  { text: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb') }
])

const updateInProgress = ref(false) // TODO

function handleConfirm () {
  // TODO
}

function handleCancel () {
  navigateToStudentDeclaredExperience({ replace: true })
}
</script>

<template>
  <PageTitle
    title=""
    :breadcrumb-links="breadcrumbLinks"
  >
    <template #title>
      <span class="n2">
        {{ t('global.buttons.update') }}
        <span class="n4">{{ declaredExperience?.title }}</span>
      </span>
    </template>
  </PageTitle>
  <div class="declared-experience-update-view av-row av-gap-2xl">
    <!-- TODO: <UpdateDeclaredExperienceSideMenu /> -->
    <div class="av-col av-flex-fill av-gap-md">
      <UpdateInProgressBadge :show="updateInProgress" />
      <AvIconText
        :icon="MDI_ICONS.INFORMATION_OUTLINE"
        :text="t('student.personalCareer.views.DeclaredExperienceUpdateView.tabs.experience.title')"
        typography-class="s2-bold"
      />
      <div class="av-col av-flex-fill av-gap-md av-row--md av-gap-2xl--md ">
        <div class="av-row av-flex-fill">
          <span>declared experience update left col placeholder with a very long text to see how it looks with the two cols.
            You can keep this layout for next devs, just remove this placeholder text
          </span>
        </div>
        <div class="av-row av-flex-fill">
          <span>declared experience update right col placeholder with a very long text to see how it looks with the two cols.
            You can keep this layout for next devs, just remove this placeholder text
          </span>
        </div>
      </div>
      <div class="av-row av-justify-end">
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.exit')"
          :confirm-label="t('global.buttons.save')"
          :confirm-disabled="!updateInProgress"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.n2 {
  color: var(--title)
}

.n4 {
  color: var(--dark-background-neutral)
}
</style>
