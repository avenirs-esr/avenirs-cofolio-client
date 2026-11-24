<script setup lang="ts">
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { ICONS, NationalToolsPaginatedList, PageTitle } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'
import LocalToolsPaginatedList from '@/features/staff/admin/views/AdminToolsView/components/LocalToolsPaginatedList/LocalToolsPaginatedList.vue'

const { t } = useI18n()

const viewKey = 'staff.admin.views.AdminToolsView'
</script>

<template>
  <PageTitle :title="t(`${viewKey}.title`)" />

  <AvTabs>
    <AvTab
      :icon="ICONS.NATIONAL"
      :title="t(`${viewKey}.tabs.nationalTools`)"
    >
      <NationalToolsPaginatedList :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name" />
    </AvTab>
    <AvTab
      :icon="ICONS.REGIONAL"
      :title="t(`${viewKey}.tabs.regionalTools`)"
    >
      <LocalToolsPaginatedList :type="EToolType.REGIONAL" />
    </AvTab>
    <AvTab
      :icon="ICONS.LOCAL"
      :title="t(`${viewKey}.tabs.localTools`)"
    >
      <LocalToolsPaginatedList :type="EToolType.LOCAL" />
    </AvTab>
  </AvTabs>
</template>
