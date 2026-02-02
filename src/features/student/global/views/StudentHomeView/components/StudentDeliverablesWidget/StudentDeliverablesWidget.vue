<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { mockedDeliverablesOverview } from '@/__mocks__/fixtures/student'
import { useNavigation } from '@/common/composables'
import { getCalendarDate, getLocalizedAbbrMonth } from '@/common/utils'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { navigateToStudentDeliverables } = useNavigation()
const { t, locale } = useI18n()

const deliverables = computed(() => mockedDeliverablesOverview.slice().slice(0, 3))

const isDemo = __DEMO_MODE__
</script>

<template>
  <HomeWidget
    :title="t('student.skills.cards.StudentSkillsWidget.title')"
    :title-icon="MDI_ICONS.WARNING_OUTLINE"
    :see-all-label="t('student.global.widgets.deliverables.buttons.seeAll')"
    :display-widget="deliverables.length > 0 && !isDemo"
    type="main"
    data-testid="student-deliverables-widget"
    @see-all-click="navigateToStudentDeliverables"
  >
    <ul class="av-col av-gap-sm av-list-reset">
      <li
        v-for="deliverable in deliverables"
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
  </HomeWidget>
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
