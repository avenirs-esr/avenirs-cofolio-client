<script lang="ts" setup>
import type { TraceOverviewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { FloatingIconCard } from '@/features/student/global'
import { AvIconText, AvTag, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceCardProps {
  trace: TraceOverviewDTO
}

const { trace } = defineProps<StudentTraceCardProps>()
const { title, authorType } = trace

const { t } = useI18n()

const category = computed(() => t('student.traces.cards.StudentTraceCard.lifeProject'))

const typeInfo = computed(() => t(`student.traces.cards.StudentTraceCard.tagLabel.${authorType}`))

const iconOptions = {
  name: MDI_ICONS.ATTACH_FILE,
  color: 'var(--text1)',
  bottom: 'var(--spacing-xl-neg)',
  right: 'var(--spacing-xs)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    class="student-trace-card av-w-full"
    :to="{ name: ROUTES.STUDENT.TRACE.name, params: { id: trace.id } }"
    data-testid="trace-card"
  >
    <FloatingIconCard
      :title="title"
      :icon-options="iconOptions"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      color="var(--surface-background)"
      :header-rows="2"
      height="16.75rem"
      title-typography-classes="b1-bold"
      title-color="var(--text1)"
    >
      <template #body>
        <div class="av-col av-gap-xs">
          <div class="student-trace-card__category">
            <AvIconText
              :icon="MDI_ICONS.SWAP_VERTICAL_VARIANT"
              :text="category"
              icon-color="var(--text1)"
              text-color="var(--text1)"
              typography-class="b2-regular"
              gap="0.75rem"
            />
          </div>
          <div class="av-row av-align-center student-trace-card__type">
            <AvTag
              data-testid="trace-card-type-tag"
              :label="typeInfo"
            />
          </div>
        </div>
      </template>
    </FloatingIconCard>
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
