<script setup lang="ts">
import type { AssociationsDTO, TraceDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/student/traces/types/forms.types'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { countElementAssociations } from '@/features/student/associations'
import ElementAssociationsCards from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.vue'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'

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
        <ElementAssociationsCards
          :context-type="EAssociationContextType.TRACE"
          :element-id="trace.id"
          :associations="associations"
        />
      </AvTab>
    </AvTabs>
  </div>
</template>
