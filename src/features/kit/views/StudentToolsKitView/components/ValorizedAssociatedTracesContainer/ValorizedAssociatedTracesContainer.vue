<script setup lang="ts">
import { useTracesView } from '@/api/avenir-esr'
import ValorizedElementsCardContainer from '@/features/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import { ValorizedItemType } from '@/features/kit/types/valorized.types'
import TraceValorizedItem from '@/features/kit/views/StudentToolsKitView/components/TraceValorizedItem/TraceValorizedItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useTracesView(
  { isAssociated: true, isValorized: true },
  { pageSize: 100 }
)

const traces = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.valorizedAssociatedTracesContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    data-testid="valorized-associated-traces-container"
  >
    <TraceValorizedItem
      v-for="trace in traces"
      :key="trace.id"
      :trace="trace"
      :type="ValorizedItemType.ASSOCIATED_TRACE"
    />
  </ValorizedElementsCardContainer>
</template>
