<script setup lang="ts">
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { NationalToolsPaginatedList, PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

const { t } = useI18n()

const viewKey = 'staff.admin.views.AdminToolsView'
</script>

<template>
  <PageTitle :title="t(`${viewKey}.title`)" />

  <AvTabs>
    <AvTab :title="t(`${viewKey}.tabs.nationalTools`)">
      <NationalToolsPaginatedList :base-route-name="ROUTES.STAFF.ADMIN.TOOL.name" />
    </AvTab>
    <AvTab :title="t(`${viewKey}.tabs.regionalTools`)">
      TODO #3228
    </AvTab>
    <AvTab :title="t(`${viewKey}.tabs.localTools`)">
      TODO #3228
    </AvTab>
  </AvTabs>
</template>
