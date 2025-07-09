<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth, parseDateISO } from '@/common/utils'
import { useStudentDeliverablesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvRichButton, AvVIcon, MDI_ICONS } from '@/ui'
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
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="deliverables-widget-container__title">
        <AvVIcon
          :name="MDI_ICONS.WARNING_OUTLINE"
          color="var(--icon)"
          :size="2"
        />
        <span class="s1-bold">
          {{ t('student.widgets.deliverables.title') }}
        </span>
      </div>
    </template>
    <template #body>
      <div class="deliverables-widget-container__body">
        <ul class="deliverables-widget__actions">
          <li
            v-for="deliverable in renderedDeliverables"
            :key="deliverable.id"
          >
            <AvRichButton
              :label="deliverable.id"
              :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
              custom-padding="0.5rem"
              :on-click="navigateToStudentDeliverables"
            >
              <div class="deliverables-widget-action__body">
                <div class="deliverables-widget-action__calendar">
                  <span class="calendar-date s1-bold">
                    {{ getCalendarDate(deliverable.deliverableUntil) }}
                  </span>
                  <span class="calendar-month caption-light">
                    {{ getLocalizedAbbrMonth(deliverable.deliverableUntil, locale as AvLocale).toUpperCase() }}
                  </span>
                </div>
                <div class="deliverables-widget-action__description ellipsis-container">
                  <span class="ellipsis b1-regular">
                    {{ t('student.widgets.deliverables.skill', { skill: deliverable.skill }) }}
                  </span>
                  <span class="ellipsis caption-light">
                    {{ t('student.widgets.deliverables.ams', { ams: deliverable.activity }) }}
                  </span>
                </div>
              </div>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="deliverables-widget-container__footer">
        <AvButton
          :label="t('student.widgets.deliverables.buttons.seeAll')"
          :on-click="navigateToStudentDeliverables"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.deliverables-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  padding-left: 0.75rem;
}

.deliverables-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.deliverables-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.deliverables-widget-action__calendar {
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

.deliverables-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.deliverables-widget-action__body {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.deliverables-widget-container__footer {
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
