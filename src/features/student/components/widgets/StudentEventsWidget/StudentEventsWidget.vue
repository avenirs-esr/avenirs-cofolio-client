<script setup lang="ts">
import type { EventOverviewDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import { useStudentEventsSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvRichButton, IconText, MDI_ICONS } from '@/ui'
import { compareAsc, format, isAfter } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { data: events } = useStudentEventsSummaryQuery()
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

const { navigateToStudentEvents } = useNavigation()
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="events-widget-container__title">
        <IconText
          :icon="MDI_ICONS.CALENDAR_MONTH"
          :text="t('student.widgets.events.title')"
          icon-color="var(--foreground-icon)"
          text-color="var(--foreground-text1)"
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
              :icon-right="MDI_ICONS.ARROW_RIGHT"
              custom-padding="0.5rem"
              :on-click="() => {}"
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
          :icon="MDI_ICONS.ARROW_RIGHT"
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
  gap: 1rem;
}

.events-widget-action__calendar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
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
  gap: 0.5rem;
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
  color: var(--foreground-text1);
  font-size: var(--font-size-xxs);
  line-height: var(--font-size-xxs);
}
</style>
