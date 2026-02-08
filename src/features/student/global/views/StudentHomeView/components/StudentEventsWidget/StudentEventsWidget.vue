<script setup lang="ts">
import type { EventOverviewDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { mockedEventsOverview } from '@/__mocks__/fixtures/student'
import { useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { navigateToStudentEvents } = useNavigation()
const { t, locale } = useI18n()

const events = computed(() => mockedEventsOverview.slice().slice(0, 3))

function getEventInfo (event: EventOverviewDTO) {
  const parsedStartDate = parseDateISO(event.startDate)
  const parsedEndDate = parseDateISO(event.endDate)
  return `${format(parsedStartDate, 'HH:mm')} - ${format(parsedEndDate, 'HH:mm')} • ${event.location}`
}

const isDemo = __DEMO_MODE__
</script>

<template>
  <HomeWidget
    :title="t('student.global.widgets.events.title')"
    :title-icon="MDI_ICONS.CALENDAR_MONTH_OUTLINE"
    :see-all-label="t('student.global.widgets.events.buttons.seeAll')"
    :display-widget="events.length > 0 && !isDemo"
    type="side"
    data-testid="student-events-widget"
    @see-all-click="navigateToStudentEvents"
  >
    <ul class="events-widget__actions av-col av-gap-sm av-list-reset">
      <li
        v-for="event in events"
        :key="event.id"
        data-testid="event-item"
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
  </HomeWidget>
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
