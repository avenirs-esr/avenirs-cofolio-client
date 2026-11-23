<script setup lang="ts">
import { NationalToolsPaginatedList, PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/constants'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('national-tools.views.NationalToolsView.title')" />
  <NationalToolsPaginatedList :base-route-name="ROUTES.NATIONAL_TOOL.name" />
</template>
