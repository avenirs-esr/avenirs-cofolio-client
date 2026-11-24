<script setup lang="ts">
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { AdminToolsPaginatedList, ICONS, PageTitle } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

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
      <AdminToolsPaginatedList
        :type="EToolType.NATIONAL"
        :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name"
      />
    </AvTab>
    <AvTab
      :icon="ICONS.REGIONAL"
      :title="t(`${viewKey}.tabs.regionalTools`)"
    >
      <AdminToolsPaginatedList
        :type="EToolType.REGIONAL"
        :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name"
      />
    </AvTab>
    <AvTab
      :icon="ICONS.LOCAL"
      :title="t(`${viewKey}.tabs.localTools`)"
    >
      <AdminToolsPaginatedList
        :type="EToolType.LOCAL"
        :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name"
      />
    </AvTab>
  </AvTabs>
</template>
