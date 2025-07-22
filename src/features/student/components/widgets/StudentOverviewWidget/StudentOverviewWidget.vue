<script setup lang="ts">
import { useBaseApiExceptionToast, useDrawer } from '@/common/composables'
import UpdateProfileDrawer from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useStudentSummaryQuery } from '@/features/student/queries'
import { AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error } = useStudentSummaryQuery()
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
          :src="studentSummary.coverPicture"
          :alt="t('student.widgets.overview.bannerAlt')"
          class="student-overview-widget__banner"
        >
        <div
          class="student-overview-widget__icon"
        >
          <img
            :src="studentSummary.profilePicture"
            :alt="t('student.widgets.overview.pictureAlt')"
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
              :label="t('student.widgets.overview.buttons.editProfile')"
              :icon-right="MDI_ICONS.PENCIL_OUTLINE"
              :on-click="displayDrawer"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.editProfile') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--share-resume"
              :label="t('student.widgets.overview.buttons.shareResume')"
              :icon-right="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.shareResume') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--share-cofolio"
              :label="t('student.widgets.overview.buttons.shareCofolio')"
              :icon-right="MDI_ICONS.SHARE_VARIANT_OUTLINE"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.shareCofolio') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--establishments"
              :label="t('student.widgets.overview.buttons.establishments')"
              :icon-right="MDI_ICONS.SWAP_HORIZONTAL"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.establishments') }}</span>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
  </AvCard>
  <UpdateProfileDrawer
    v-if="studentSummary"
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
</style>
