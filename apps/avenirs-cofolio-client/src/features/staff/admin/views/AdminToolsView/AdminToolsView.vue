<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import { ManageToolsDropdown, PageTitle, ToolTabs } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

const { t } = useI18n()

const viewKey = 'staff.admin.views.AdminToolsView'

const addInteractiveProps = computed<AvInteractiveProps>(() => ({
  disabled: true,
  disabledTooltip: t(`${viewKey}.addDisabledTootlip`)
}))
</script>

<template>
  <PageTitle
    :title="t(`${viewKey}.title`)"
    :information-tooltip="t(`${viewKey}.informationTooltip`)"
  >
    <template #actions>
      <ManageToolsDropdown :add-interactive-props="addInteractiveProps" />
    </template>
  </PageTitle>

  <ToolTabs
    :local-base-route-name="ROUTES.STAFF.ADMIN.TOOL.LOCAL.name"
    :national-base-route-name="ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name"
    :regional-base-route-name="ROUTES.STAFF.ADMIN.TOOL.REGIONAL.name"
  />
</template>
