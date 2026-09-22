<script setup lang="ts">
import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/student/traces/types/forms.types'
import { type AssociationsDTO, EAssociationContextType, type TraceDetailDTO } from '@/api/avenir-esr'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ICONS } from '@/common/constants'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateTabsProps {
  trace: TraceDetailDTO
  associations?: AssociationsDTO
  form: UpdateTraceFormApi
}

const { trace, associations, form } = defineProps<UpdateTabsProps>()

const { t } = useI18n()

enum UpdateTabsIndexes {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const activeTab = useEnumRouteQuery(
  'tab',
  UpdateTabsIndexes,
  UpdateTabsIndexes.DETAILS
)

const associationCount = computed(() => countElementAssociations(EAssociationContextType.TRACE, associations))
</script>

<template>
  <div class="av-col">
    <AvTabs
      v-model="activeTab"
      :lazy-render="false"
    >
      <AvTab
        :title="t('student.traces.views.StudentUpdateTraceView.update.tabs.details')"
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        data-testid="update-trace-details-tab"
      >
        <UpdateTraceForm
          :trace="trace"
          :form="form"
        />
      </AvTab>
      <AvTab
        :title="t('student.traces.views.StudentUpdateTraceView.associations', { count: associationCount })"
        :icon="ICONS.ASSOCIATIONS"
        data-testid="update-trace-associations-tab"
      >
        <ElementAssociations
          :context-type="EAssociationContextType.TRACE"
          :element-id="trace.id"
          :associations="associations"
          readonly
        />
      </AvTab>
    </AvTabs>
  </div>
</template>
