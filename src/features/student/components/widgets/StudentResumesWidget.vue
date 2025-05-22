<script setup lang="ts">
import type { ResumeDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useNavigation } from '@/common/composables'
import { formatDateToLocaleString, parseDateISO } from '@/common/utils'
import { useStudentResumesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const { data: resumes } = useStudentResumesSummaryQuery()
const renderedResumes = computed(() => resumes.value.slice(0, 3))
const { navigateToStudentResumes } = useNavigation()

function getFormattedUpdatedAt (resume: ResumeDTO) {
  const parsedDate = parseDateISO(resume.updatedAt)
  return formatDateToLocaleString(parsedDate, locale.value as AvLocale)
}
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="resumes-widget-container__title">
        <VIcon
          :name="MDI_ICONS.FILE_ACCOUNT"
          color="var(--foreground-icon)"
          scale="1.5"
        />
        <span class="s1-bold">
          {{ t('student.widgets.resumes.title') }}
        </span>
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
              :icon-right="MDI_ICONS.ARROW_RIGHT"
              custom-padding="0.5rem"
              :on-click="() => {}"
            >
              <div class="resumes-widget-action__body">
                <div class="resumes-widget-action__leftIcon">
                  <VIcon
                    :name="MDI_ICONS.FILE_ACCOUNT"
                    color="var(--white)"
                    scale="1.25"
                  />
                </div>
                <div class="resumes-widget-action__description ellipsis-container">
                  <span class="ellipsis b1-regular">{{ resume.name }}</span>
                  <span class="ellipsis caption-light">
                    {{ t('student.widgets.resumes.updatedAt', { date: getFormattedUpdatedAt(resume) }) }}
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
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.resumes-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
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
