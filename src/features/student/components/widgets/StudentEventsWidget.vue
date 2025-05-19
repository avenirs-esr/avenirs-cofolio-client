<script setup lang="ts">
import type { EventDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useNavigation } from '@/common/composables/use-navigation'
import { getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import { AvButton, AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import { compareAsc, format, getDate, isAfter } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { events } = defineProps<{ events: Array<EventDTO> }>()

const { t, locale } = useI18n()

const renderedEvents = computed(() => {
  return events
    .slice()
    .filter(event => isAfter(parseDateISO(event.startDate), new Date()))
    .sort((a, b) => compareAsc(parseDateISO(a.startDate), parseDateISO(b.startDate)))
    .slice(0, 3)
})

function getCalendarDate (date: string) {
  const parsedDate = parseDateISO(date)
  return getDate(parsedDate)
}

function getAbbrMonth (date: string) {
  const parsedDate = parseDateISO(date)
  return getLocalizedAbbrMonth(parsedDate, locale.value as AvLocale).toUpperCase()
}

function getEventInfo (event: EventDTO) {
  const parsedStartDate = parseDateISO(event.startDate)
  const parsedEndDate = parseDateISO(event.startDate)
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
        <VIcon
          :name="MDI_ICONS.FILE_ACCOUNT"
          color="var(--foreground-icon)"
          scale="1.5"
        />
        <span class="s1-bold">
          {{ t('student.widgets.events.title') }}
        </span>
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
                    {{ getAbbrMonth(event.startDate) }}
                  </span>
                </div>
                <div class="events-widget-action__description">
                  <span class="event-name b1-regular">
                    {{ event.name }}
                  </span>
                  <span class="event-info caption-light">
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
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
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
}

.events-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 15rem;
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

.event-name,
.event-info {
  display: block;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  width: 15rem;
}
</style>
