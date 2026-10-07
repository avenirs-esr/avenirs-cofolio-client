<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import { ROUTES } from '@/common/constants'
import { getDaysUntil, parseDate } from '@/common/utils'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import TraceAiProducedBadge from '@/features/student/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.vue'
import TraceAttachmentTypeBadge from '@/features/student/traces/components/badges/TraceAttachmentTypeBadge/TraceAttachmentTypeBadge.vue'
import TraceAuthorTypeBadge from '@/features/student/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const { trace } = defineProps<{ trace: TraceViewDTO }>()
const { id, title, isAssociated, willBeDeletedAt } = trace

const getDaysUntilDeletion = computed(() => !isAssociated && willBeDeletedAt
  ? getDaysUntil(parseDate(willBeDeletedAt))
  : -1)

const { t } = useI18n()

const iconOptions = {
  name: MDI_ICONS.ATTACH_FILE,
  color: 'var(--icon)',
  bottom: 'var(--spacing-xl-neg)',
  right: '0.75rem',
  borderColor: 'var(--other-border-skill-card)',
}
</script>

<template>
  <RouterLink
    v-bind="$attrs"
    class="student-detailed-trace-card av-w-full"
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
      height="fit-content"
    >
      <template #body>
        <div class="av-row av-gap-sm av-wrap">
          <ValorizedBadge :valorized="trace.valorized" />
          <TraceAuthorTypeBadge :author-type="trace.authorType" />
          <TraceAiProducedBadge :ai-produced="!!trace.aiUseJustification" />
          <TraceAttachmentTypeBadge :file-type="trace.attachment?.fileType" />
        </div>
      </template>

      <template #footer>
        <div class="student-detailed-trace-card__footer">
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
  :deep(.floating-icon-card__footer) {
    justify-content: flex-start;
  }
}
</style>
