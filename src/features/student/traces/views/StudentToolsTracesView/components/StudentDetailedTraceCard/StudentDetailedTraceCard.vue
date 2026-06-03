<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { getDaysUntil, parseDateISO } from '@/common/utils'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const { trace } = defineProps<{ trace: TraceViewDTO }>()
const { id, title, isAssociated, willBeDeletedAt } = trace

const getDaysUntilDeletion = computed(() => !isAssociated && willBeDeletedAt
  ? getDaysUntil(parseDateISO(willBeDeletedAt))
  : -1)

const { t } = useI18n()

const iconOptions = {
  name: MDI_ICONS.ATTACH_FILE,
  color: 'var(--icon)',
  bottom: 'calc(-1 * var(--spacing-lg))',
  right: '0.75rem',
  borderColor: 'var(--other-border-skill-card)',
}
</script>

<template>
  <RouterLink
    v-bind="$attrs"
    class="student-detailed-trace-card"
    :to="{ name: ROUTES.STUDENT.TOOLS_TRACE.name, params: { id } }"
  >
    <FloatingIconCard
      :title="title"
      :icon-options="iconOptions"
      color="var(--light-background-neutral)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="2"
      title-typography-classes="b1-bold"
      title-color="var(--text1)"
      height="16.4375rem"
    >
      <template #footer>
        <div class="student-detailed-trace-card__body">
          <AvIconText
            v-if="getDaysUntilDeletion > 0"
            :icon="MDI_ICONS.HOURGLASS"
            :text="t('student.traces.views.StudentToolsTracesView.studentDetailedTraceCard.getDaysUntilDeletion', { count: getDaysUntilDeletion })"
            icon-color="var(--text2)"
            text-color="var(--text2)"
            typography-class="b2-regular"
            gap="0.75rem"
          />
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.student-detailed-trace-card {
  width: 41.25rem;

  :deep(.floating-icon-card__footer) {
    justify-content: flex-start;
  }
}
</style>
