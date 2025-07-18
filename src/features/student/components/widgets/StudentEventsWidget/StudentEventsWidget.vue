<script setup lang="ts">
import type { EventOverviewDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import { useStudentEventsSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvIconText, AvRichButton, MDI_ICONS } from '@/ui'
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
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="events-widget-container__title">
        <AvIconText
          :icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
          :text="t('student.widgets.events.title')"
          icon-color="var(--icon)"
          text-color="var(--text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <div class="events-widget-container__body">
        <ul class="events-widget__actions">
          <li
            v-for="event in renderedEvents"
            :key="event.id"
          >
            <AvRichButton
              :label="event.name"
              :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
              custom-padding="var(--spacing-xs)"
            >
              <div class="events-widget-action__body">
                <div class="events-widget-action__calendar">
                  <span class="calendar-date s1-bold">
                    {{ getCalendarDate(event.startDate) }}
                  </span>
                  <span class="calendar-month caption-light">
                    {{ getLocalizedAbbrMonth(event.startDate, locale as AvLocale).toUpperCase() }}
                  </span>
                </div>
                <div class="events-widget-action__description ellipsis-container">
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
      </div>
    </template>
    <template #footer>
      <div class="events-widget-container__footer">
        <AvButton
          :label="t('student.widgets.events.buttons.seeAll')"
          :on-click="navigateToStudentEvents"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.events-widget-container__title {
  padding-left: 0.75rem;
}

.events-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.events-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: var(--spacing-sm);
}

.events-widget-action__calendar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  border-radius: var(--radius-md);
  background-color: var(--other-background-event-date);
  flex-shrink: 0;
}

.events-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.events-widget-action__body {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}

.events-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}

.calendar-date {
  color: var(--dark-background-primary1);
  line-height: var(--font-size-s1);
}

.calendar-month {
  color: var(--text1);
  font-size: var(--font-size-xxs);
  line-height: var(--font-size-xxs);
}
</style>
