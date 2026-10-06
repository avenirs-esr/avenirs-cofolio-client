<script lang="ts" setup>
import type { AvLocale } from '@/types'
import { useGetActivityInactiveStudents } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { formatDateLocalized } from '@/common/utils'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface InactiveStudentsDetailsCardProps {
  activityId: string
}

const { activityId } = defineProps<InactiveStudentsDetailsCardProps>()

const { t, locale } = useI18n()

const { data, isLoading, error } = useGetActivityInactiveStudents(computed(() => activityId))

const inactiveStudents = computed(() => data.value ?? [])

function formatDate (date: string): string {
  return formatDateLocalized(date, locale.value as AvLocale, true)
}
</script>

<template>
  <div
    class="inactive-students-details-card av-col av-w-full av-radius-lg"
    data-testid="inactive-students-details-card"
  >
    <div class="inactive-students-details-card__header av-row av-align-center av-px-md av-py-sm">
      <AvIconText
        :icon="MDI_ICONS.CALENDAR_CLOCK_OUTLINE"
        :text="t('staff.activities.views.NationalActivityCatalogView.InactiveStudentsDetailsCard.title', { count: inactiveStudents.length })"
        icon-color="var(--dark-background-primary1)"
        text-color="var(--text1)"
        typography-class="s1-bold"
        gap="var(--spacing-xs)"
        inline
      />
    </div>

    <QuerySuspense
      :is-loading="isLoading"
      :is-empty="inactiveStudents.length === 0"
      :empty-state-message="t('staff.activities.views.NationalActivityCatalogView.InactiveStudentsDetailsCard.empty')"
      :error="error"
    >
      <ul class="inactive-students-details-card__list av-list-reset av-col av-w-full">
        <li
          v-for="{ student, enrolledAt, lastViewedAt } in inactiveStudents"
          :key="student.id"
          class="av-col av-gap-xxs av-px-md av-py-md"
          data-testid="inactive-student-item"
        >
          <span
            class="b1-bold av-text-text1"
            data-testid="inactive-student-name"
          >
            {{ student.lastName }} {{ student.firstName }}
          </span>
          <div class="av-row av-wrap av-gap-md">
            <span
              class="b2-regular av-text-text2"
              data-testid="inactive-student-enrolled-at"
            >
              {{ t('staff.activities.views.NationalActivityCatalogView.InactiveStudentsDetailsCard.enrolledAt', { date: formatDate(enrolledAt) }) }}
            </span>
            <span
              class="b2-regular av-text-text2"
              data-testid="inactive-student-last-viewed-at"
            >
              {{
                lastViewedAt
                  ? t('staff.activities.views.NationalActivityCatalogView.InactiveStudentsDetailsCard.lastViewedAt', { date: formatDate(lastViewedAt) })
                  : t('staff.activities.views.NationalActivityCatalogView.InactiveStudentsDetailsCard.neverViewed')
              }}
            </span>
          </div>
        </li>
      </ul>
    </QuerySuspense>
  </div>
</template>

<style scoped lang="scss">
.inactive-students-details-card {
  overflow: hidden;
  background-color: var(--other-background-base);
  border: 1px solid var(--light-background-neutral);

  &__header {
    background-color: var(--light-background-primary1);
  }

  &__list {
    li + li {
      border-top: 1px solid var(--stroke);
    }
  }
}
</style>
