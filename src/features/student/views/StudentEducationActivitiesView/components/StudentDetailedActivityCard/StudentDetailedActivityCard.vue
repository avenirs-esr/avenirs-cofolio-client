<script lang="ts" setup>
import type { AvLocale } from '@/types/i18n.types'
import { formatDateToLocaleString } from '@/common/utils'
import { studentActivityRoute } from '@/features/student/routes'
import { type ActivityDTO, ActivityStatus } from '@/types'
import { AvBadge, AvCard, IconText, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { activity } = defineProps<{ activity: ActivityDTO }>()
const { name, startedActivityCount, totalActivityCount, skillCount, trackCount, status } = activity

const { locale, t } = useI18n()

// TODO: placeholder waiting for US specific to deliverable
const mockedDeliverableCount = computed(() => Math.floor(Math.random() * 3))
function getRandomStatus (): 'TO_SUBMIT' | 'VALIDATED' {
  if (Math.random() > 0.5) {
    return 'TO_SUBMIT'
  }
  return 'VALIDATED'
}
const mockedDeliverableStatus = computed(() => getRandomStatus())
function generateRandomDateIn2026 () {
  const startOf2026 = new Date('2026-01-01T00:00:00Z')
  const startTimestamp = startOf2026.getTime()
  const endOf2026 = new Date('2026-12-31T23:59:59.999Z')
  const endTimestamp = endOf2026.getTime()
  const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp)
  const randomDate = new Date(randomTimestamp)
  return randomDate
}
const randomDateIn2026 = computed(() => generateRandomDateIn2026())
const mockedDelivarableDueDate = computed(() => formatDateToLocaleString(
  randomDateIn2026.value.toString(),
  locale.value as AvLocale
))
function getDeliverableBadge (status: 'TO_SUBMIT' | 'VALIDATED') {
  switch (status) {
    case 'TO_SUBMIT':
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.deliverables.toSubmit',
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: '/assets/icons/warning-outline.svg'
      }
    case 'VALIDATED':
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.deliverables.validated',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: '/assets/icons/calendar-range-outline.svg'
      }
  }
}
const mockedDeliverableBadge = computed(() => getDeliverableBadge(mockedDeliverableStatus.value))
// END OF MOCK

function getStatusBadge (status: ActivityStatus) {
  switch (status) {
    case ActivityStatus.COMPLETED:
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.status.completed',
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: '/assets/icons/calendar-check-outline.svg'
      }
    case ActivityStatus.IN_PROGRESS:
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.status.inProgress',
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: '/assets/icons/calendar-range-outline.svg'
      }
    case ActivityStatus.NOT_STARTED:
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.status.notStarted',
        color: 'var(--light-foreground-neutral)',
        backgroundColor: 'var(--light-background-neutral)',
        iconPath: '/assets/icons/calendar-range-outline.svg'
      }
    case ActivityStatus.SUBMITTED:
      return {
        labelkey: 'student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.status.submitted',
        color: 'var(--dark-background-critical)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: '/assets/icons/calendar-range-outline.svg'
      }
  }
}

const statusBadge = computed(() => getStatusBadge(status))
</script>

<template>
  <RouterLink
    class="student-detailed-activity-card"
    :to="{ name: studentActivityRoute.name, params: { id: activity.id } }"
  >
    <AvCard
      border-color="--other-border-skill-card"
      title-background="--dark-background-primary1"
    >
      <template #title>
        <div class="student-detailed-activity-card__title ellipsis-container">
          <span class="n5 ellipsis">
            {{ name }}
          </span>
          <div class="student-detailed-activity-card__icon">
            <VIcon
              :name="MDI_ICONS.BOOK_LOCATION"
              color="var(--background-card2)"
              scale="2"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-detailed-activity-card__body">
          <div class="student-detailed-activity-card__firstLine">
            <div class="student-detailed-activity-card__line">
              <AvBadge
                v-if="totalActivityCount > 0"
                class="student-detailed-activity-card__activity-badge"
                :label="t('student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.activityCount', { startedActivityCount, totalActivityCount, count: totalActivityCount })"
                color="var(--foreground-text1)"
                background-color="var(--background-surface-background)"
                icon-path="/assets/icons/text-box-check-outline.svg"
                small
                ellipsis
              />
              <IconText
                :icon="MDI_ICONS.STAR_SHOOTING"
                :text="t('student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.skillCount', { count: skillCount })"
              />
              <IconText
                :icon="MDI_ICONS.ATTACH_FILE"
                :text="t('student.views.studentEducationActivitiesView.container.studentDetailedActivityCard.trackCount', { count: trackCount })"
              />
            </div>
            <div class="student-detailed-activity-card__line">
              <AvBadge
                v-bind="statusBadge"
                :label="t(statusBadge.labelkey)"
                small
                ellipsis
              />
            </div>
          </div>
          <div class="student-detailed-activity-card__line">
            <AvBadge
              v-if="mockedDeliverableCount > 0"
              v-bind="mockedDeliverableBadge"
              :label="t(mockedDeliverableBadge.labelkey, { count: mockedDeliverableCount, date: mockedDelivarableDueDate })"
              small
              ellipsis
            />
            <div
              v-else
              class="student-detailed-activity-card__delivarable-placeholder"
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

.student-detailed-activity-card {
  display: flex;
  width: 100%;
  border-radius: 1.5rem;
}

.student-detailed-activity-card__title {
  position: relative
}

.student-detailed-activity-card__icon {
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

.student-detailed-activity-card__body {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding-top: 0.875rem;
}

.student-detailed-activity-card__firstLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}

.student-detailed-activity-card__line {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.student-detailed-activity-card__counts {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}

.student-detailed-activity-card__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.student-detailed-activity-card__delivarable-placeholder {
  height: 1.5rem;
}

.n5 {
  color: var(--background-card2);
}

.n6 {
  color: var(--foreground-text1);
}
</style>
