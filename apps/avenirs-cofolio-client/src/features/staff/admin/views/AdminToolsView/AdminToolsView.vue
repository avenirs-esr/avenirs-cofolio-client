<script setup lang="ts">
import { PageTitle, ToolTabs } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

const { t } = useI18n()

const viewKey = 'staff.admin.views.AdminToolsView'
</script>

<template>
  <PageTitle :title="t(`${viewKey}.title`)" />

  <ToolTabs :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name" />
</template>
