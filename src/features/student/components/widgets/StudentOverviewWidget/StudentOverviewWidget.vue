<script setup lang="ts">
import { useBaseApiExceptionToast } from '@/common/composables'
import { useStudentSummaryQuery } from '@/features/student/queries'
import { AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error } = useStudentSummaryQuery()
useBaseApiExceptionToast(error)
const { t } = useI18n()

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
    background-color="--white"
    title-background="--white"
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
              :icon-right="MDI_ICONS.PENCIL"
              :on-click="() => {}"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.editProfile') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--share-resume"
              :icon-right="MDI_ICONS.FILE_ACCOUNT"
              :on-click="() => {}"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.shareResume') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--share-cofolio"
              :icon-right="MDI_ICONS.SHARE_VARIANT"
              :on-click="() => {}"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.shareCofolio') }}</span>
            </AvRichButton>
          </li>
          <li>
            <AvRichButton
              class="av-rich-button--establishments"
              :icon-right="MDI_ICONS.SWAP_HORIZONTAL"
              :on-click="() => {}"
            >
              <span class="b1-regular">{{ t('student.widgets.overview.buttons.establishments') }}</span>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.student-overview-widget__title {
  position: relative;
  min-height: 4rem;
}

.student-overview-widget__icon {
  position: absolute;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  border: 4px solid var(--dark-foreground);
  right: 1rem;
  top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-overview-widget__banner {
  width: 100%;
  height: auto;
  max-height: 4.2rem;
  border-radius: 0.5rem;
}

.student-overview-widget__picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-overview-widget__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.student-overview-bio {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 5;
}

.student-overview-widget__footer {
  padding-top: 1rem;
}

.student-overview-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.student-overview-widget__action-avCard {
  width: 100%;
  border-radius: 0.75rem;
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
