<script setup lang="ts">
import type { TraceAssociationsDTO, TraceDetailDTO } from '@/api/avenir-esr'
import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/student/traces/types/forms.types'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateTabsProps {
  trace: TraceDetailDTO
  associations?: TraceAssociationsDTO
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

const associationCount = computed(() =>
  (associations?.declaredSkillAssociations?.length ?? 0)
  + (associations?.declaredActivityAssociations?.length ?? 0)
)
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
        :icon="MDI_ICONS.LINK"
        data-testid="update-trace-associations-tab"
      >
        <TraceAssociations
          :associations="associations"
          :trace-id="trace.id"
        >
          <template #caption>
            <span class="caption-regular">
              {{ t('student.traces.views.StudentUpdateTraceView.update.tabs.associations.caption') }}
            </span>
          </template>
        </TraceAssociations>
      </AvTab>
    </AvTabs>
  </div>
</template>
