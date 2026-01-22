<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentResumesSummaryQuery } from '@/features/student/global/queries/use-student-resumes.query/use-student-resumes.query'
import { AvButton, AvCard, AvIcon, AvIconText, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: resumes, error } = useStudentResumesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentResumes } = useNavigation()
const { locale, t } = useI18n()

const renderedResumes = computed(() => resumes.value.slice(0, 3))

// TODO DRY: create HomeSideWidget and HomeMainWidget #998
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="av-pl-xs">
        <AvIconText
          :icon="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
          :text="t('student.global.widgets.resumes.title')"
          icon-color="var(--icon)"
          text-color="var(--text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <ul class="av-col av-gap-sm av-list-reset">
        <li
          v-for="resume in renderedResumes"
          :key="resume.id"
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
                <span class="ellipsis caption-light">
                  {{ t('student.global.widgets.resumes.updatedAt', { date: formatDateToLocaleString(resume.updatedAt, locale as AvLocale) }) }}
                </span>
              </div>
            </div>
          </AvRichButton>
        </li>
      </ul>
    </template>
    <template #footer>
      <div class="av-row av-justify-end av-pt-sm">
        <AvButton
          :label="t('student.global.widgets.resumes.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentResumes"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.resumes-widget-action__leftIcon {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}
</style>
