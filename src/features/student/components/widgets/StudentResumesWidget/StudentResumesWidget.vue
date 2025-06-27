<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentResumesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvIconText, AvRichButton, AvVIcon, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { data: resumes, error } = useStudentResumesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentResumes } = useNavigation()
const { locale, t } = useI18n()

const renderedResumes = computed(() => resumes.value.slice(0, 3))
</script>

<template>
  <AvCard
    background-color="--other-background-base"
    title-background="--other-background-base"
  >
    <template #title>
      <div class="resumes-widget-container__title">
        <AvIconText
          :icon="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
          :text="t('student.widgets.resumes.title')"
          icon-color="var(--icon)"
          text-color="var(--text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <div class="resumes-widget-container__body">
        <ul class="resumes-widget__actions">
          <li
            v-for="resume in renderedResumes"
            :key="resume.id"
          >
            <AvRichButton
              :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
              custom-padding="0.5rem"
              :on-click="() => {}"
            >
              <div class="resumes-widget-action__body">
                <div class="resumes-widget-action__leftIcon">
                  <AvVIcon
                    :name="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
                    color="var(--other-background-base)"
                    :size="1.5"
                  />
                </div>
                <div class="resumes-widget-action__description ellipsis-container">
                  <span class="ellipsis b1-regular">{{ resume.name }}</span>
                  <span class="ellipsis caption-light">
                    {{ t('student.widgets.resumes.updatedAt', { date: formatDateToLocaleString(resume.updatedAt, locale as AvLocale) }) }}
                  </span>
                </div>
              </div>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="resumes-widget-container__footer">
        <AvButton
          :label="t('student.widgets.resumes.buttons.seeAll')"
          :on-click="navigateToStudentResumes"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.resumes-widget-container__title {
  padding-left: 0.75rem;
}

.resumes-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.resumes-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.resumes-widget-action__leftIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}

.resumes-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.resumes-widget-action__body {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.resumes-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
