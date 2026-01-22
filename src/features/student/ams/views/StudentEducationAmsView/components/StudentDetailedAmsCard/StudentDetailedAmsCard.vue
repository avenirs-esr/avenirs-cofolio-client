<script lang="ts" setup>
import type { AmsViewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import StudentAmsStatusBadge from '@/features/student/ams/components/badges/StudentAmsStatusBadge/StudentAmsStatusBadge.vue'
import StudentCountSkillsIconText from '@/features/student/ams/views/StudentEducationAmsView/components/StudentDetailedAmsCard/components/StudentCountSkillsIconText/StudentCountSkillsIconText.vue'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import StudentCountTracesIconText from '@/features/student/traces/components/base/StudentCountTracesIconText/StudentCountTracesIconText.vue'
import { AvBadge, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { ams } = defineProps<{ ams: AmsViewDTO }>()
const { id, title, progress, countSkills, countTraces, status } = ams
const { startedActivities, totalActivities } = progress

const { t } = useI18n()

const iconOptions = {
  name: MDI_ICONS.BOOK_LOCATION_OUTLINE,
  color: 'var(--card2)',
  bottom: 'calc(-1 * var(--spacing-lg))',
  right: '0.75rem',
  borderColor: 'var(--other-border-skill-card)',
}
</script>

<template>
  <RouterLink
    class="student-detailed-ams-card av-w-full"
    :to="{ name: ROUTES.STUDENT.ACTIVITY.name, params: { id } }"
  >
    <FloatingIconCard
      class="student-detailed-ams-card"
      :title="title"
      :icon-options="iconOptions"
      color="var(--dark-background-primary1)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="1"
      title-typography-classes="n5"
      height="14rem"
    >
      <template #body>
        <div class="av-col av-gap-md">
          <div class="av-row av-justify-between av-align-center av-pr-4xl">
            <div class="av-row av-align-center av-gap-sm">
              <AvBadge
                v-if="totalActivities > 0"
                :label="t('student.ams.views.StudentEducationAmsView.studentDetailedAmsCard.activityCount', { startedActivities, totalActivities, count: totalActivities })"
                color="var(--text1)"
                background-color="var(--surface-background)"
                :icon="ICONS_DATA_URL.MDI_TEXT_BOX_CHECK_OUTLINE"
                small
                ellipsis
                data-testid="student-detailed-ams-card__ams-badge"
              />
              <StudentCountSkillsIconText
                :count-skills="countSkills"
                inline
              />
              <StudentCountTracesIconText
                :count-traces="countTraces"
                inline
              />
            </div>
            <StudentAmsStatusBadge
              :status="status"
            />
          </div>
          <div class="av-row av-align-center av-gap-sm">
            <div
              class="student-detailed-ams-card__delivarable-placeholder"
            />
          </div>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  width: 100%;
}

.student-detailed-ams-card {
  :deep(.n5) {
    color: var(--card2);
  }

  &__delivarable-placeholder {
    height: var(--dimension-md);
  }
}
</style>
