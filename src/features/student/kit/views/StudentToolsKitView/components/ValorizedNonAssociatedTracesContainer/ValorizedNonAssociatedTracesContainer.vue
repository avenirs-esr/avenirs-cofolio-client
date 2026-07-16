<script setup lang="ts">
import { useTracesView } from '@/api/avenir-esr'
import ValorizedElementsCardContainer from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, error, isFetching } = useTracesView(
  { isAssociated: false, isValorized: true },
  { pageSize: 100 }
)

const totalElements = computed(() => data.value?.page?.totalElements ?? 0)
</script>

<template>
  <ValorizedElementsCardContainer
    :title="t('student.kit.views.StudentToolsKitView.valorizedNonAssociatedTracesContainer.title', { count: totalElements })"
    :error="error"
    :is-loading="isFetching"
    data-testid="valorized-non-associated-traces-container"
  >
    <div data-testid="valorized-non-associated-traces-container-placeholder">
      Placeholder
    </div>
  </ValorizedElementsCardContainer>
</template>
