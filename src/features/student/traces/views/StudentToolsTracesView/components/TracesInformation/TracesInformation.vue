<script lang="ts" setup>
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvCard
    border-color="transparent"
    title-background="var(--card2)"
    background-color="var(--card2)"
  >
    <template #title>
      <span class="n4 av-text-text1">{{ t('student.traces.views.StudentToolsTracesView.TracesInformation.title') }}</span>
    </template>
    <span class="b1-regular">{{ t('student.traces.views.StudentToolsTracesView.TracesInformation.description') }}</span>
  </AvCard>
</template>
