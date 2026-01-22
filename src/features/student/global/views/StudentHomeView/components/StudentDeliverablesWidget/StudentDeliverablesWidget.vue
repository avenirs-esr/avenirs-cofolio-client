<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import {
  useStudentDeliverablesSummaryQuery
} from '@/features/student/global/queries/use-student-deliverables.query/use-student-deliverables.query'
import { AvButton, AvCard, AvIcon, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { compareAsc, isAfter } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { data: deliverables, error } = useStudentDeliverablesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentDeliverables } = useNavigation()
const { t, locale } = useI18n()

const renderedDeliverables = computed(() => {
  return deliverables.value
    .slice()
    .filter(deliverable => isAfter(parseDateISO(deliverable.deliverableUntil), new Date()))
    .sort((a, b) => compareAsc(parseDateISO(a.deliverableUntil), parseDateISO(b.deliverableUntil)))
    .slice(0, 3)
})

// TODO DRY: create HomeSideWidget and HomeMainWidget #998
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="av-row av-gap-sm av-align-center av-pl-sm">
        <AvIcon
          :name="MDI_ICONS.WARNING_OUTLINE"
          color="var(--icon)"
          :size="2"
        />
        <span class="n5">
          {{ t('student.global.widgets.deliverables.title') }}
        </span>
      </div>
    </template>
    <template #body>
      <ul class="av-col av-gap-sm av-list-reset">
        <li
          v-for="deliverable in renderedDeliverables"
          :key="deliverable.id"
        >
          <AvRichButton
            :label="deliverable.id"
            :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
            custom-padding="var(--spacing-xs)"
            @click="navigateToStudentDeliverables"
          >
            <div class="av-row av-gap-xs">
              <div class="deliverables-widget-action__calendar av-col av-justify-center av-align-center av-radius-md">
                <span class="calendar-date s1-bold">
                  {{ getCalendarDate(deliverable.deliverableUntil) }}
                </span>
                <span class="calendar-month caption-light av-text-text1">
                  {{ getLocalizedAbbrMonth(deliverable.deliverableUntil, locale as AvLocale).toUpperCase() }}
                </span>
              </div>
              <div class="av-col av-align-start ellipsis-container">
                <span class="ellipsis b1-regular">
                  {{ t('student.global.widgets.deliverables.skill', { skill: deliverable.skill }) }}
                </span>
                <span class="ellipsis caption-light">
                  {{ t('student.global.widgets.deliverables.ams', { ams: deliverable.activity }) }}
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
          :label="t('student.global.widgets.deliverables.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentDeliverables"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.deliverables-widget-action__calendar {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  background-color: var(--other-background-event-date);
  flex-shrink: 0;
}

.calendar-date {
  color: var(--dark-background-primary1);
  line-height: var(--font-size-s1);
}

.calendar-month {
  font-size: var(--font-size-xxs);
  line-height: var(--font-size-xxs);
}
</style>
