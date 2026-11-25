<script lang="ts" setup>
import { PageTitle, ToolTabs } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nKey = 'student.tools.views.LearnerToolsView.title'
</script>

<template>
  <PageTitle :title="t(i18nKey)" />

  <ToolTabs />
</template>
