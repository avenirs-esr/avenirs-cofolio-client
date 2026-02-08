<script setup lang="ts">
import { useBaseApiExceptionToast, useDrawer } from '@/common/composables'
import UpdateProfileDrawer from '@/features/student/user/components/overlays/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useStudentSummaryQuery } from '@/features/student/user/queries/use-student-profile/use-student-profile.query'
import { AvCard, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error, refetch } = useStudentSummaryQuery()
useBaseApiExceptionToast(error)
const { t } = useI18n()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()

const fullName = computed(() => {
  if (!studentSummary.value) {
    return
  }
  const { firstname, lastname } = studentSummary.value
  return `${capitalize(firstname)} ${capitalize(lastname)}`
})

watch(showDrawer, () => {
  refetch()
})

defineExpose({ fullName })
</script>

<template>
  <AvCard
    v-if="studentSummary"
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
    data-testid="student-overview-widget"
  >
    <template #title>
      <div class="student-overview-widget__title">
        <img
          :src="studentSummary.coverPicture.url"
          :alt="t('student.user.cards.StudentOverviewWidget.bannerAlt')"
          class="student-overview-widget__banner av-w-full av-radius-md"
          data-testid="profile-banner"
        >
        <div
          class="student-overview-widget__icon av-row av-justify-center av-align-center av-radius-md"
        >
          <img
            :src="studentSummary.profilePicture.url"
            :alt="t('student.user.cards.StudentOverviewWidget.pictureAlt')"
            class="student-overview-widget__picture av-w-full av-h-full"
            data-testid="profile-picture"
          >
        </div>
      </div>
    </template>
    <template #body>
      <div class="av-col av-gap-xs">
        <span class="n4">{{ fullName }}</span>
        <span class="b2-light student-overview-bio">{{ studentSummary.bio }}</span>
      </div>
    </template>
    <template #footer>
      <div class="av-pt-sm">
        <ul class="av-col av-gap-sm av-list-reset">
          <li>
            <AvRichButton
              class="av-rich-button--edit-profile"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.editProfile')"
              :icon-right="MDI_ICONS.PENCIL_OUTLINE"
              data-testid="edit-profile-button"
              @click="displayDrawer"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.editProfile') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--share-resume"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.shareResume')"
              :icon-right="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
              data-testid="share-resume-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareResume') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--share-cofolio"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio')"
              :icon-right="MDI_ICONS.SHARE_VARIANT_OUTLINE"
              data-testid="share-cofolio-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--establishments"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.establishments')"
              :icon-right="MDI_ICONS.SWAP_HORIZONTAL"
              data-testid="my-establishments-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.establishments') }}</span>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
  </AvCard>
  <UpdateProfileDrawer
    v-if="studentSummary"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    :student-summary="studentSummary"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>

<style lang="scss" scoped>
.student-overview-widget__title {
  position: relative;
  min-height: var(--dimension-4xl);
}

.student-overview-widget__icon {
  position: absolute;
  width: var(--dimension-5xl);
  height: var(--dimension-5xl);
  border: 4px solid var(--dark-foreground);
  right: var(--spacing-sm);
  top: var(--spacing-sm);
}

.student-overview-widget__banner {
  height: auto;
  max-height: 4.2rem;
}

.student-overview-widget__picture {
  object-fit: cover;
}

.student-overview-bio {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 5;
  -webkit-line-clamp: 5;
}

:deep(.av-card__title) {
  display: block;
}
</style>
