<script setup lang="ts">
import { AdminToolsPaginatedList, PageTitle } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/constants'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('national-tools.views.NationalToolsView.title')" />
  <AdminToolsPaginatedList
    :type="EToolType.NATIONAL"
    :base-route-name="ROUTES.NATIONAL_TOOL.name"
  />
</template>
