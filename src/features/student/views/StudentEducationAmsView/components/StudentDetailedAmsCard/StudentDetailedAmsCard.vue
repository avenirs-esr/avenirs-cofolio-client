<script lang="ts" setup>
import type { AmsViewDTO } from '@/api/avenir-esr'
import { StudentAmsStatusBadge, StudentCountSkillsIconText, StudentCountTracesIconText } from '@/features/student/components'
import { studentAmsRoute } from '@/features/student/routes'
import { AvBadge, AvCard, AvVIcon, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { ams } = defineProps<{ ams: AmsViewDTO }>()
const { id, title, progress, countSkills, countTraces, status } = ams
const { startedActivities, totalActivities } = progress

const { t } = useI18n()
</script>

<template>
  <RouterLink
    class="student-detailed-ams-card"
    :to="{ name: studentAmsRoute.name, params: { id } }"
  >
    <AvCard
      border-color="--other-border-skill-card"
      title-background="--dark-background-primary1"
    >
      <template #title>
        <div class="student-detailed-ams-card__title ellipsis-container">
          <span class="n5 ellipsis">
            {{ title }}
          </span>
          <div class="student-detailed-ams-card__icon">
            <AvVIcon
              :name="MDI_ICONS.BOOK_LOCATION"
              color="var(--background-card2)"
              :size="2.1875"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-detailed-ams-card__body">
          <div class="student-detailed-ams-card__firstLine">
            <div class="student-detailed-ams-card__line">
              <AvBadge
                v-if="totalActivities > 0"
                class="student-detailed-ams-card__ams-badge"
                :label="t('student.views.studentEducationAmsView.amsListContainer.StudentDetailedAmsCard.activityCount', { startedActivities, totalActivities, count: totalActivities })"
                color="var(--foreground-text1)"
                background-color="var(--background-surface-background)"
                icon-path="/assets/icons/text-box-check-outline.svg"
                small
                ellipsis
              />
              <StudentCountSkillsIconText
                :count-skills="countSkills"
                inline
              />
              <StudentCountTracesIconText
                :count-traces="countTraces"
                inline
              />
            </div>
            <div class="student-detailed-ams-card__line">
              <StudentAmsStatusBadge
                :status="status"
              />
            </div>
          </div>
          <div class="student-detailed-ams-card__line">
            <div
              class="student-detailed-ams-card__delivarable-placeholder"
            />
          </div>
        </div>
      </template>
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  width: 100%;
}

.av-card:hover {
  border: 1px solid var(--dark-background-primary1) !important;
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}

.student-detailed-ams-card {
  display: flex;
  width: 100%;
  border-radius: 1.5rem;
}

.student-detailed-ams-card__title {
  position: relative
}

.student-detailed-ams-card__icon {
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.75rem;
  border: 1px solid white;
  right: 0;
  top: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--dark-background-primary1);
}

.student-detailed-ams-card__body {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding-top: 0.875rem;
}

.student-detailed-ams-card__firstLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}

.student-detailed-ams-card__line {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.student-detailed-ams-card__counts {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}

.student-detailed-ams-card__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.student-detailed-ams-card__delivarable-placeholder {
  height: 1.5rem;
}

.n5 {
  color: var(--background-card2);
}

.n6 {
  color: var(--foreground-text1);
}
</style>
