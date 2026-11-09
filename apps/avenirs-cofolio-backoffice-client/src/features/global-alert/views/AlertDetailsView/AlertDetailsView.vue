<script setup lang="ts">
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import { AvButton, AvNotice, AvTable, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ActiveBadge, DatePeriodPicker, DetailPageTitle, fromInstant, QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useGetAlertConfig } from '@/api/avenir-esr'
import { ROUTES } from '@/constants'

const { t } = useI18n()
const { data: alert, isLoading, error } = useGetAlertConfig()

const title = computed(() => t('global-alert.entityName'))

const startDate = computed(() => fromInstant(alert?.value?.startDate))
const endDate = computed(() => fromInstant(alert?.value?.endDate))

const WIDTH_MAP: Record<string, string> = {
  label: '10%',
  value: '90%',
}

const columns: AvTableColumn<{ label: string, value: string }>[] = [
  {
    key: 'label',
    label: t('global-alert.views.AlertDetailsView.components.dataDisplay.AlertDetailsTable.columns.label'),
    width: WIDTH_MAP.label
  },
  {
    key: 'value',
    label: t('global-alert.views.AlertDetailsView.components.dataDisplay.AlertDetailsTable.columns.value'),
    width: WIDTH_MAP.value
  },
]

const rows = computed(() => [
  {
    id: 'active',
    label: t('global-alert.views.AlertDetailsView.components.dataDisplay.AlertDetailsTable.rows.status'),
    value: String(alert?.value?.active ?? false)
  },
  {
    id: 'period',
    label: t('global-alert.views.AlertDetailsView.components.dataDisplay.AlertDetailsTable.rows.period'),
    value: `${startDate.value} - ${endDate.value}`
  },
  {
    id: 'render',
    label: t('global-alert.views.AlertDetailsView.components.dataDisplay.AlertDetailsTable.rows.render'),
    value: alert?.value?.message ?? ''
  },
])
</script>

<template>
  <DetailPageTitle :title="title">
    <template #actions>
      <AvButton
        :label="t('global-alert.views.AlertDetailsView.updateButton')"
        :to="ROUTES.GLOBAL_ALERT.UPDATE"
        :icon="MDI_ICONS.PENCIL_OUTLINE"
      />
    </template>
  </DetailPageTitle>

  <div class="av-col av-gap-sm">
    <QuerySuspense
      :error
      :is-loading
      :is-empty="!alert"
      :empty-state-message="t('global-alert.views.AlertDetailsView.emptyState')"
    >
      <h2>{{ t('global-alert.views.AlertDetailsView.subtitle') }}</h2>
      <AvTable
        :columns="columns"
        :rows="rows"
        row-key="id"
      >
        <template #cell(label)="{ row }">
          <span>{{ row.label }}</span>
        </template>
        <template #cell(value)="{ row }">
          <ActiveBadge
            v-if="row.id === 'active'"
            :active="row.value === String(true)"
            label-gender="FEMININE"
          />
          <DatePeriodPicker
            v-if="row.id === 'period'"
            type="datetime-local"
            input-format="dd/MM/yyyy HH:mm"
            output-format="dd/MM/yyyy HH:mm"
            disabled
            :show-ongoing="false"
            :start-date="startDate"
            :end-date="endDate"
          />
          <AvNotice
            v-if="row.id === 'render'"
            :title="row.value"
            type="alert"
          />
        </template>
      </AvTable>
    </QuerySuspense>
  </div>
</template>
