<script setup lang="ts">
import type { ResumeDTO } from '@/types'
import { useNavigation } from '@/common/composables/use-navigation'
import { formatDateToLocaleString } from '@/common/utils'
import { AvButton, AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { resumes } = defineProps<{ resumes: Array<ResumeDTO> }>()

const { locale, t } = useI18n()

const renderedResumes = computed(() => resumes.slice(0, 3))

const { navigateToStudentResumes } = useNavigation()
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
                <div class="resumes-widget-action__description">
                  <span class="b1-regular">{{ resume.name }}</span>
                  <span class="caption-light">
                    {{ t('student.widgets.resumes.lastUpdate', { date: formatDateToLocaleString(resume.lastUpdated, locale) }) }}
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
