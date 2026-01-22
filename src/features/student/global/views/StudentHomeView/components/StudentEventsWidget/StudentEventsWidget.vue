<script setup lang="ts">
import type { EventOverviewDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import { useStudentEventsSummaryQuery } from '@/features/student/global/queries/use-student-events.query/use-student-events.query'
import { AvButton, AvCard, AvIconText, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { compareAsc, format, isAfter } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { data: events, error } = useStudentEventsSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentEvents } = useNavigation()
const { t, locale } = useI18n()

const renderedEvents = computed(() => {
  return events.value
    .slice()
    .filter(event => isAfter(parseDateISO(event.startDate), new Date()))
    .sort((a, b) => compareAsc(parseDateISO(a.startDate), parseDateISO(b.startDate)))
    .slice(0, 3)
})

function getEventInfo (event: EventOverviewDTO) {
  const parsedStartDate = parseDateISO(event.startDate)
  const parsedEndDate = parseDateISO(event.endDate)
  return `${format(parsedStartDate, 'HH:mm')} - ${format(parsedEndDate, 'HH:mm')} • ${event.location}`
}

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
          :icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
          :text="t('student.global.widgets.events.title')"
          icon-color="var(--icon)"
          text-color="var(--text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <ul class="events-widget__actions av-col av-gap-sm av-list-reset">
        <li
          v-for="event in renderedEvents"
          :key="event.id"
        >
          <AvRichButton
            :label="event.name"
            :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
            custom-padding="var(--spacing-xs)"
          >
            <div class="av-row av-gap-xs">
              <div class="events-widget-action__calendar av-col av-justify-center av-align-center av-radius-md">
                <span class="calendar-date s1-bold">
                  {{ getCalendarDate(event.startDate) }}
                </span>
                <span class="calendar-month av-text-text1 caption-light">
                  {{ getLocalizedAbbrMonth(event.startDate, locale as AvLocale).toUpperCase() }}
                </span>
              </div>
              <div class="av-col av-align-start ellipsis-container">
                <span class="ellipsis b1-regular">
                  {{ event.name }}
                </span>
                <span class="ellipsis caption-light">
                  {{ getEventInfo(event) }}
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
          :label="t('student.global.widgets.events.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentEvents"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.events-widget-action__calendar {
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
