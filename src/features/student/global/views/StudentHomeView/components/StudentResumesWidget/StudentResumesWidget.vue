<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { mockedResumesOverview } from '@/__mocks__/fixtures/student'
import { useNavigation } from '@/common/composables'
import { formatDateLocalized } from '@/common/utils'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import { AvIcon, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { navigateToStudentResumes } = useNavigation()
const { locale, t } = useI18n()

const resumes = computed(() => mockedResumesOverview.slice(0, 3))

const isDemo = __DEMO_MODE__
</script>

<template>
  <HomeWidget
    :title="t('student.global.widgets.resumes.title')"
    :title-icon="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
    :see-all-label="t('student.global.widgets.resumes.buttons.seeAll')"
    :display-widget="resumes.length > 0 && !isDemo"
    type="side"
    data-testid="student-resumes-widget"
    @see-all-click="navigateToStudentResumes"
  >
    <div class="av-col av-gap-md">
      <ul class="av-col av-gap-sm av-list-reset">
        <li
          v-for="resume in resumes"
          :key="resume.id"
          data-testid="resume-item"
        >
          <AvRichButton
            :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
            :label="resume.name"
            custom-padding="var(--spacing-xs)"
          >
            <div class="av-row av-gap-xs">
              <div class="resumes-widget-action__leftIcon av-row av-justify-center av-align-center av-radius-md">
                <AvIcon
                  :name="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
                  color="var(--other-background-base)"
                  :size="1.5"
                />
              </div>
              <div class="av-col av-align-start ellipsis-container">
                <span class="ellipsis b1-regular">{{ resume.name }}</span>
                <span
                  class="ellipsis caption-light"
                  data-testid="resume-item-updated-at"
                >
                  {{ t('student.global.widgets.resumes.updatedAt', { date: formatDateLocalized(resume.updatedAt, locale as AvLocale) }) }}
                </span>
              </div>
            </div>
          </AvRichButton>
        </li>
      </ul>
    </div>
  </HomeWidget>
</template>

<style lang="scss" scoped>
.resumes-widget-action__leftIcon {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}
</style>
