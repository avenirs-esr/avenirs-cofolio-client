<script setup lang="ts">
import { ManageToolsDropdown, PageTitle, ToolsPaginatedList } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/constants'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('national-tools.views.NationalToolsView.title')">
    <template #actions>
      <ManageToolsDropdown
        is-national
        :entity-name="t('national-tools.views.NationalToolsView.toolsEntityName')"
      />
    </template>
  </PageTitle>
  <ToolsPaginatedList
    :type="EToolType.NATIONAL"
    :base-route-name="ROUTES.NATIONAL_TOOL.name"
  />
</template>
