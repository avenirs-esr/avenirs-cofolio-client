<script lang="ts" setup>
import type { TraceViewDTO } from '@/api/avenir-esr'
import type { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import type { AvLocale } from '@/types'
import { formatDateLocalized } from '@/common/utils/date/date'
import { formatFileSizeInMegabytes } from '@/common/utils/file/file'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import TraceAiProducedBadge from '@/features/student/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.vue'
import TraceAuthorTypeBadge from '@/features/student/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.vue'
import TraceFileTypeBadge from '@/features/student/traces/components/badges/TraceFileTypeBadge/TraceFileTypeBadge.vue'
import { useI18n } from 'vue-i18n'

export interface TraceValorizedItemProps {
  trace: TraceViewDTO
  type: ValorizedItemType.ASSOCIATED_TRACE | ValorizedItemType.NON_ASSOCIATED_TRACE
}

const { trace, type } = defineProps<TraceValorizedItemProps>()

const { t, locale } = useI18n()

const formattedCreatedAt = computed(() => formatDateLocalized(trace.createdAt, locale.value as AvLocale, true))
const formattedFileSize = computed(() => trace.attachment ? formatFileSizeInMegabytes(trace.attachment.fileSize, locale.value as AvLocale) : '')
</script>

<template>
  <ValorizedItem
    :title="trace.title"
    :item-id="trace.id"
    :type="type"
  >
    <div class="av-row av-align-center av-wrap av-gap-xs">
      <span class="b2-regular">
        {{ t('student.kit.views.StudentToolsKitView.traceValorizedItem.addedOn', { date: formattedCreatedAt }) }}<template v-if="trace.attachment"> • {{ formattedFileSize }} {{ t('global.megabyteUnit') }}</template>
      </span>
      <TraceFileTypeBadge
        v-if="trace.attachment"
        :file-type="trace.attachment.fileType"
      />
      <TraceAuthorTypeBadge
        v-if="trace.authorType"
        :author-type="trace.authorType"
      />
      <TraceAiProducedBadge :ai-produced="!!trace.aiUseJustification" />
    </div>
    <span
      v-if="trace.personalNote"
      class="caption-regular av-max-lines"
      data-testid="trace-valorized-item-personal-note"
    >
      {{ t('student.kit.views.StudentToolsKitView.traceValorizedItem.personalNote', { note: trace.personalNote }) }}
    </span>
  </ValorizedItem>
</template>
