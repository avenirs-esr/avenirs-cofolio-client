<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { FloatingIconCard } from '@/features/student/global'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceViewCompactCardProps {
  trace: TraceViewDTO
}

const { trace } = defineProps<StudentTraceViewCompactCardProps>()

const iconOptions = {
  name: MDI_ICONS.ATTACH_FILE,
  color: 'var(--text1)',
  bottom: 'calc(-1 * var(--spacing-xl))',
  right: 'var(--spacing-xs)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    class="student-trace-card student-trace-card--compact av-w-full"
    :to="{ name: ROUTES.STUDENT.TRACE.name, params: { id: trace.id } }"
    data-testid="trace-card"
  >
    <FloatingIconCard
      :title="trace.title"
      :icon-options="iconOptions"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      color="var(--surface-background)"
      :header-rows="2"
      height="8rem"
      title-typography-classes="b1-bold"
      title-color="var(--text1)"
    />
  </RouterLink>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.student-trace-card {
  @include dsav.min-width(md) {
    width: 17.25rem;
  }
}
</style>
