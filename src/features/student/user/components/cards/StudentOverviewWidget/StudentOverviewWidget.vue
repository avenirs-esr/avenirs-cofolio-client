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
  >
    <template #title>
      <div class="student-overview-widget__title">
        <img
          :src="studentSummary.coverPicture.url"
          :alt="t('student.user.cards.StudentOverviewWidget.bannerAlt')"
          class="student-overview-widget__banner"
        >
        <div
          class="student-overview-widget__icon"
        >
          <img
            :src="studentSummary.profilePicture.url"
            :alt="t('student.user.cards.StudentOverviewWidget.pictureAlt')"
            class="student-overview-widget__picture"
          >
        </div>
      </div>
    </template>
    <template #body>
      <div class="student-overview-widget__body">
        <span class="n4">{{ fullName }}</span>
        <span class="b2-light student-overview-bio">{{ studentSummary.bio }}</span>
      </div>
    </template>
    <template #footer>
      <div class="student-overview-widget__footer">
        <ul class="student-overview-widget__actions">
          <li>
            <AvRichButton
              class="av-rich-button--edit-profile"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.editProfile')"
              :icon-right="MDI_ICONS.PENCIL_OUTLINE"
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
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareResume') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--share-cofolio"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio')"
              :icon-right="MDI_ICONS.SHARE_VARIANT_OUTLINE"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--establishments"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.establishments')"
              :icon-right="MDI_ICONS.SWAP_HORIZONTAL"
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
  border-radius: var(--radius-md);
  border: 4px solid var(--dark-foreground);
  right: var(--spacing-sm);
  top: var(--spacing-sm);
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-overview-widget__banner {
  width: 100%;
  height: auto;
  max-height: 4.2rem;
  border-radius: var(--radius-md);
}

.student-overview-widget__picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-overview-widget__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.student-overview-bio {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 5;
  -webkit-line-clamp: 5;
}

.student-overview-widget__footer {
  padding-top: var(--spacing-sm);
}

.student-overview-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: var(--spacing-sm);
}

.student-overview-widget__action-avCard {
  width: 100%;
  border-radius: var(--radius-lg);
}

.student-overview-widget__action-avCard-line {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

li {
  padding: 0;
  margin: 0;
}

:deep(.av-card__title) {
  display: block;
}
</style>
